import { SOCKET_NAMESPACE_IM, SOCKET_ORIGIN_EXCLUDE, SOCKET_PING_INTERVAL, SOCKET_PING_TIMEOUT } from '@libs/common/constant'
import { FactoryName } from '@libs/common/enums/factory'
import { ImMessageStatusEnum, ImUserStatusEnum } from '@libs/common/enums/im'
import { RedisCacheKey } from '@libs/common/enums/redis'
import { SubAppPortEnum } from '@libs/common/enums/subapps'
import { MongoService } from '@libs/common/services/prisma.service'
import { Inject } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets'
import { instrument } from '@socket.io/admin-ui'
import Redis from 'ioredis'
import { Namespace, Server, Socket } from 'socket.io'
import { ulid } from 'ulid'
import { ImUserService } from '../im-user/im-user.service'

// TODO: refactor code style
@WebSocketGateway(SubAppPortEnum.GatewayEvent, {
  cors: {
    origin: SOCKET_ORIGIN_EXCLUDE,
    credentials: true,
  },
  pingInterval: SOCKET_PING_INTERVAL,
  pingTimeout: SOCKET_PING_TIMEOUT,
  namespace: SOCKET_NAMESPACE_IM,
})

export class EventsGateway {
  @WebSocketServer()
  server: Server

  private socket: Socket
  private userId?: string

  constructor(
    private mongoService: MongoService,

    private jwtService: JwtService,

    @Inject(FactoryName.RedisFactory)
    private redis: Redis,

    private imUserService: ImUserService,
  ) {

  }

  afterInit(namespace: Namespace) {
    instrument(namespace.server, { auth: false, mode: 'production' })
    this.server.on('connection', async (socket) => {
      this.socket = socket

      this.server.emit('ready')

      socket.on('disconnect', async () => {
        if (this.userId) {
          this.redis.del(`${RedisCacheKey.SocketId}${this.userId}`)
          await this.mongoService.imUser.update({ data: { status: ImUserStatusEnum.OFFLINE }, where: { userId: this.userId } })
        }
      })
    })
  }

  @SubscribeMessage('send-message') // TODO: perf params handle
  async handleSendMessage(@MessageBody() data: { toUser: string, content: string }) {
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

    const socketId = await this.redis.get(`${RedisCacheKey.SocketId}:${data.toUser}`)

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

  @SubscribeMessage('read-message')
  async handleReadMessage(@MessageBody() data: { toUser: string }) {
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

  @SubscribeMessage('join-group')
  async handleJoinGroup(@MessageBody() data: { groupId: string }) {
    const res = await this.socket.join(data.groupId)
    return res
  }

  // @SubscribeMessage('create-group')
  // async handleCreateGroup(@MessageBody() data: { groupName: string }) {
  //   const groupId = ulid()

  //   await this.mongoService.imGroup.create({
  //     data: {
  //       groupId,
  //       groupName: data.groupName,
  //       createdBy: this.userId,
  //     },
  //   })

  //   return groupId
  // }

  @SubscribeMessage('login')
  async handleLogin() {
    const res = await this.jwtService.verifyAsync<{ userId: string, email: string }>(this.socket.handshake.auth.token)

    if (!res.userId) {
      this.server.emit('error', 'login-error')
      return false
    }
    const { userId } = res

    this.userId = userId

    const { data } = await this.imUserService.login(userId)

    const updateInfo = await this.mongoService.imUser.update({ data: { status: ImUserStatusEnum.ONLINE }, where: { userId: data.userId } })

    await this.redis.set(`${RedisCacheKey.SocketId}${userId}`, this.socket.id)

    return updateInfo
  }
}
