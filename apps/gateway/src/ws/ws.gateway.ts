import { FactoryName } from '@libs/common/enums/factory'
import { SubAppPortEnum } from '@libs/common/enums/subapps'
import { MysqlService } from '@libs/common/services/prisma.service'
import { Inject } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { instrument } from '@socket.io/admin-ui'
import Redis from 'ioredis'
import { Namespace, Server, Socket } from 'socket.io'

@WebSocketGateway(SubAppPortEnum.GatewayEvent, {
  cors: {
    origin: ['https://admin.socket.io', 'http://localhost:3300'],
    credentials: true,
  },
  pingInterval: 2000,
  pingTimeout: 3000,
  namespace: 'im',
})

export class EventsGateway {
  @WebSocketServer()
  server: Server

  private socket: Socket
  private userId: string

  constructor(
    private mysqlService: MysqlService,
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
      // this.MysqlService.imUser.update({ data: { status: 0 }, where: { userId } })
      this.redis.set(`socket:chat:${userId}`, socket.id)
    })
  }

  @SubscribeMessage('receive-message')
  handleReceiveMessage(@MessageBody() data: { id: number, name: string, message: string }) {
    this.server.emit('message', data.message)
  }

  @SubscribeMessage('send-message')
  async handleSendMessage(@MessageBody() data: { toUser: string, content: string }) {
    const socketId = await this.redis.get(`socket:chat:${data.toUser}`)
    if (socketId) {
      this.server.to(socketId).emit('receive-message', data.content)
    }
  }

  @SubscribeMessage('join')
  handleJoin(@MessageBody() data: { id: number, name: string }) {
    this.server.emit('join', data)
  }

  @SubscribeMessage('leave')
  handleLeave(@MessageBody() data: { id: number, name: string }) {
    this.server.emit('leave', data)
  }
}
