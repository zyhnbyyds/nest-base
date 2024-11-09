import { SOCKET_EVENT } from '@libs/common/constant/socket-event'
import { FactoryName } from '@libs/common/enums/factory'
import { ImMessageStatusEnum, ImUserStatusEnum } from '@libs/common/enums/im'
import { RedisCacheKey } from '@libs/common/enums/redis'
import { MongoService } from '@libs/common/services/prisma.service'
import { Snowflake } from '@libs/common/utils/snow-flake'
import { Inject, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import Redis from 'ioredis'
import { Server, Socket } from 'socket.io'
import { ulid } from 'ulid'
import { ImUserService } from '../im-user/im-user.service'
import { CreateRoomDto } from './dto/create-room.dto'
import { SendMessageDto } from './dto/send-message.dto'

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
    private imUserService: ImUserService,
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

    // Mark: 如果不用await, 这条会不执行
    await this.mongoService.imMessage.create({
      data: {
        messageId: ulid(),
        content: data.content,
        fromUserId: this.userId,
        toUserId: data.toUser,
        status: ImMessageStatusEnum.UNREAD,
      },
    })

    const socketId = await this.redis.get(`${RedisCacheKey.SocketId}${data.toUser}`)

    if (socketId) {
      this.server.to(socketId).emit('receive-message', data.content)
    }
    else {
      // TODO: add cache
      await this.mongoService.imMessage.create({
        data: {
          messageId: ulid(),
          content: data.content,
          fromUserId: this.userId,
          toUserId: data.toUser,
          status: ImMessageStatusEnum.UNREAD,
        },
      })
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
    const res = await this.jwtService.verifyAsync<{ userId: string, email: string }>(this.socket.handshake.auth.token)

    if (!res.userId) {
      this.socket.emit('error', 'login-error')
      return false
    }

    const { userId } = res

    this.userId = userId

    this.init(userId, server)

    const { data } = await this.imUserService.login(userId)

    const updateInfo = await this.mongoService.imUser.update({ data: { status: ImUserStatusEnum.ONLINE }, where: { userId: data.userId } })

    await this.redis.set(`${RedisCacheKey.SocketId}${userId}`, this.socket.id)

    return updateInfo
  }

  afterSeverConnection(socket: Socket) {
    socket.emit(SOCKET_EVENT.READY)

    this.socket = socket

    socket.on(SOCKET_EVENT.DISCONNECT, async () => {
      if (this.userId) {
        // this.redis.del(`${RedisCacheKey.SocketId}${this.userId}`)
        await this.mongoService.imUser.update({ data: { status: ImUserStatusEnum.OFFLINE }, where: { userId: this.userId } })
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

    const joinInfo = await this.socket.join(res.groupId)
    console.log(joinInfo, this.socket.rooms)
    return res
  }
}
