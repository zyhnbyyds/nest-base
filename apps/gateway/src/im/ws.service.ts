import { SOCKET_EVENT } from '@libs/common/constant/socket-event'
import { FactoryName } from '@libs/common/enums/factory'
import { ImMessageStatusEnum, ImUserStatusEnum } from '@libs/common/enums/im'
import { RedisCacheKey } from '@libs/common/enums/redis'
import { MongoService, MysqlService } from '@libs/common/services/prisma.service'
import { Result } from '@libs/common/utils/result'
import { Snowflake } from '@libs/common/utils/snow-flake'
import { Inject, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import Redis from 'ioredis'
import { Namespace, Server, Socket } from 'socket.io'
import { ulid } from 'ulid'
import { CreateRoomDto } from './dto/create-room.dto'
import { SendMessageDto } from './dto/send-message.dto'

@Injectable()
export class WsService {
  private server: Namespace
  constructor(
    private mongoService: MongoService,
    private jwtService: JwtService,
    private mysqlService: MysqlService,

    @Inject(FactoryName.RedisFactory)
    private redis: Redis,
  ) {
  }

  async sendMessage(socket: Socket, data: SendMessageDto) {
    const userId = socket.handshake.auth.userId
    if (!userId) {
      socket.emit('error', 'login-first')
      return false
    }

    const socketId = await this.redis.get(`${RedisCacheKey.SocketId}${data.toUser}`)

    const fromUserInfo = await this.mysqlService.user.findUnique({ where: { userId } })

    const messageInfo = {
      content: data.content,
      fromUser: fromUserInfo,
      toUser: data.toUser,
      messageType: data.messageType,
    }

    await this.mongoService.imMessage.create({
      data: {
        messageId: ulid(),
        content: data.content,
        fromUserId: userId,
        toUserId: data.toUser,
        status: ImMessageStatusEnum.UNREAD,
      },
    })
    if (socketId) {
      return this.server.to(socketId).emit(SOCKET_EVENT.RECEIVE_MESSAGE, messageInfo)
    }
    return false
  }

  async readMessage(socket: Socket, data: { toUser: string }) {
    const userId = socket.handshake.auth.userId
    await this.mongoService.imMessage.updateMany({
      data: {
        status: ImMessageStatusEnum.READ,
      },
      where: {
        toUserId: data.toUser,
        fromUserId: userId,
        status: ImMessageStatusEnum.UNREAD,
      },
    })
  }

  async login(socket: Socket) {
    try {
      const userId = socket.handshake.auth.userId
      let data = await this.mongoService.imUser.findUnique({ where: { userId } })
      if (!data) {
        data = await this.mongoService.imUser.create({ data: { userId, status: ImUserStatusEnum.ONLINE, userName: '' } })
      }

      const updateInfo = await this.mongoService.imUser.update({ data: { status: ImUserStatusEnum.ONLINE }, where: { userId: data.userId } })
      await this.redis.set(`${RedisCacheKey.SocketId}${userId}`, socket.id)

      return Result.success(updateInfo)
    }
    catch (error) {
      socket.emit('error', error)
      return Result.fail(error)
    }
  }

  async afterSeverConnection(socket: Socket, server: Namespace) {
    const { token, userId } = socket.handshake.auth as { token: string, userId: string }
    this.server = server

    if (!token) {
      socket.emit(SOCKET_EVENT.ERROR, 'authentication error')
      socket.disconnect()
    }
    try {
      const payload = await this.jwtService.verifyAsync<{
        userId: string
        email: string
      }>(token)

      const cacheSocketId = await this.redis.get(`${RedisCacheKey.SocketId}${payload.userId}`)
      const cacheToken = await this.redis.get(`${RedisCacheKey.AuthToken}${payload.userId}`)

      // 如果缓存的socketId和token不一致，那么就踢掉之前的socket
      if (cacheSocketId !== socket.id || cacheToken !== token) {
        await this.redis.set(`${RedisCacheKey.SocketId}${payload.userId}`, socket.id)
        await this.redis.set(`${RedisCacheKey.AuthToken}${payload.userId}`, token)
        server.sockets.get(cacheSocketId)?.disconnect()
      }
    }

    // eslint-disable-next-line unused-imports/no-unused-vars
    catch (_error) {
      socket.emit(SOCKET_EVENT.ERROR, 'authentication error')
      socket.disconnect()
    }
    socket.emit(SOCKET_EVENT.READY)

    socket.on(SOCKET_EVENT.DISCONNECT, async () => {
      const imUserInfo = await this.mongoService.imUser.findUnique({ where: { userId } })
      if (!imUserInfo) {
        await this.mongoService.imUser.create({ data: { status: ImUserStatusEnum.OFFLINE, userName: '', userId } })
      }
      else {
        await this.mongoService.imUser.update({ data: { status: ImUserStatusEnum.OFFLINE }, where: { userId } })
      }
      this.redis.del(`${RedisCacheKey.SocketId}${userId}`)
    })
  }

  async createRoom(socket: Socket, body: CreateRoomDto) {
    const { userId } = socket.handshake.auth
    const res = await this.mongoService.imGroup.create({
      data: {
        ...body,
        createdBy: userId,
        groupId: new Snowflake(1, 1).generateId(),
        masterId: userId,
      },
    })

    // const joinInfo = await this.socket.join(res.groupId)
    // console.log(joinInfo, this.socket.rooms)
    return res
  }
}
