import { SOCKET_EVENT } from '@libs/common/constant/socket-event'
import { FactoryName } from '@libs/common/enums/factory'
import { ImMessageStatusEnum, ImUserStatusEnum } from '@libs/common/enums/im'
import { RedisCacheKey } from '@libs/common/enums/redis'
import { MongoService } from '@libs/common/services/prisma.service'
import { Result } from '@libs/common/utils/result'
import { Snowflake } from '@libs/common/utils/snow-flake'
import { Inject, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import Redis from 'ioredis'
import { Server, Socket } from 'socket.io'
import { ulid } from 'ulid'
import { CreateRoomDto } from './dto/create-room.dto'
import { SendMessageDto } from './dto/send-message.dto'

interface UserVerify {
  userId: string
  email: string
}

@Injectable()
export class WsService {
  private userId: string
  private server: Server
  private socket: Socket
  constructor(
    private mongoService: MongoService,
    private jwtService: JwtService,

    @Inject(FactoryName.RedisFactory)
    private redis: Redis,
  ) {
  }

  init(userId: string, server: Server) {
    this.userId = userId
    this.server = server
  }

  async sendMessage(data: SendMessageDto) {
    if (!this.userId) {
      // TODO: perf error handle
      this.server.emit('error', 'login-first')
      return false
    }

    const socketId = await this.redis.get(`${RedisCacheKey.SocketId}${data.toUser}`)

    if (socketId) {
      await this.mongoService.imMessage.create({
        data: {
          messageId: ulid(),
          content: data.content,
          fromUserId: this.userId,
          toUserId: data.toUser,
          status: ImMessageStatusEnum.UNREAD,
        },
      })
      this.server.to(socketId).emit('receiveMessage', { content: data.content, fromUser: this.userId, toUser: data.toUser, messageType: data.messageType })
    }
    else {
      await this.mongoService.imMessage.create({
        data: {
          messageId: ulid(),
          content: data.content,
          fromUserId: this.userId,
          toUserId: data.toUser,
          status: ImMessageStatusEnum.UNREAD,
        },
      })
      this.server.to(socketId).emit('receiveMessage', data.content)
    }
  }

  async readMessage(data: { toUser: string }) {
    await this.mongoService.imMessage.updateMany({
      data: {
        status: ImMessageStatusEnum.READ,
      },
      where: {
        toUserId: data.toUser,
        fromUserId: this.userId,
        status: ImMessageStatusEnum.UNREAD,
      },
    })
  }

  async login(server: Server) {
    let res: UserVerify | null
    try {
      res = await this.jwtService.verifyAsync<UserVerify>(this.socket.handshake.auth.token)
    }
    catch (error) {
      this.socket.emit('error', error)
      return Result.fail(error, 403)
    }

    try {
      if (!res || !res.userId) {
        this.socket.emit('error', 'login-error')
        return Result.fail('login-error')
      }

      const { userId } = res

      this.userId = userId

      let data = await this.mongoService.imUser.findUnique({ where: { userId } })
      if (!data) {
        data = await this.mongoService.imUser.create({ data: { userId, status: ImUserStatusEnum.ONLINE, userName: '' } })
      }

      const updateInfo = await this.mongoService.imUser.update({ data: { status: ImUserStatusEnum.ONLINE }, where: { userId: data.userId } })
      await this.redis.set(`${RedisCacheKey.SocketId}${userId}`, this.socket.id)
      this.init(userId, server)

      return Result.success(updateInfo)
    }
    catch (error) {
      this.socket.emit('error', error)
      return Result.fail(error)
    }
  }

  afterSeverConnection(socket: Socket) {
    socket.emit(SOCKET_EVENT.READY)

    this.socket = socket

    socket.on(SOCKET_EVENT.DISCONNECT, async () => {
      if (this.userId) {
        const imUserInfo = await this.mongoService.imUser.findUnique({ where: { userId: this.userId } })
        if (!imUserInfo) {
          await this.mongoService.imUser.create({ data: { ...imUserInfo, status: ImUserStatusEnum.OFFLINE } })
        }
        else {
          await this.mongoService.imUser.update({ data: { status: ImUserStatusEnum.OFFLINE }, where: { userId: this.userId } })
        }
      }
    })
  }

  async createRoom(body: CreateRoomDto) {
    const res = await this.mongoService.imGroup.create({
      data: {
        ...body,
        createdBy: this.userId,
        groupId: new Snowflake(1, 1).generateId(),
        masterId: this.userId,
      },
    })

    // const joinInfo = await this.socket.join(res.groupId)
    // console.log(joinInfo, this.socket.rooms)
    return res
  }
}
