import { SOCKET_NAMESPACE_IM, SOCKET_ORIGIN_EXCLUDE, SOCKET_PING_INTERVAL, SOCKET_PING_TIMEOUT } from '@libs/common/constant'
import { FactoryName } from '@libs/common/enums/factory'
import { SubAppPortEnum } from '@libs/common/enums/subapps'
import { MongoService } from '@libs/common/services/prisma.service'
import { Inject } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { instrument } from '@socket.io/admin-ui'
import Redis from 'ioredis'
import { Namespace, Server, Socket } from 'socket.io'
import { ulid } from 'ulid'

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
  private userId: string

  constructor(
    private mongoService: MongoService,
    private jwtService: JwtService,
    @Inject(FactoryName.RedisFactory)
    private redis: Redis,
  ) {

  }

  afterInit(namespace: Namespace) {
    instrument(namespace.server, { auth: false, mode: 'production' })
    this.server.on('connection', async (socket) => {
      this.socket = socket
      const { userId } = await this.jwtService.verifyAsync<{ userId: string, email: string }>(this.socket.handshake.auth.token)
      this.userId = userId
      await this.mongoService.imUser.update({ data: { status: 0 }, where: { userId } })
      this.redis.set(`socket:chat:${userId}`, socket.id)

      socket.on('disconnect', async () => {
        this.redis.del(`socket:chat:${userId}`)
        await this.mongoService.imUser.update({ data: { status: 1 }, where: { userId } })
      })
    })
  }

  @SubscribeMessage('send-message')
  async handleSendMessage(@MessageBody() data: { toUser: string, content: string }) {
    await this.mongoService.imMessage.create({
      data: {
        messageId: ulid(),
        content: data.content,
        fromUserId: this.userId,
        toUserId: data.toUser,
      },
    })
    const socketId = await this.redis.get(`socket:chat:${data.toUser}`)
    if (socketId) {
      this.server.to(socketId).emit('receive-message', data.content)
    }
  }
}
