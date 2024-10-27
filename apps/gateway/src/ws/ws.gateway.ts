import { SOCKET_NAMESPACE_IM, SOCKET_ORIGIN_EXCLUDE, SOCKET_PING_INTERVAL, SOCKET_PING_TIMEOUT } from '@libs/common/constant'
import { SOCKET_EVENT } from '@libs/common/constant/socket-event'
import { SubAppPortEnum } from '@libs/common/enums/subapps'
import { NestedValidationErrors, validateWsBody } from '@libs/common/utils/validate'
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { instrument } from '@socket.io/admin-ui'
import { Namespace, Server, Socket } from 'socket.io'
import { SendMessageDto } from './dto/send-message.dto'
import { WsService } from './ws.service'

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

  constructor(
    private readonly wsService: WsService,
  ) {
  }

  afterInit(namespace: Namespace) {
    instrument(namespace.server, { auth: false, mode: 'production' })
    this.server.on(SOCKET_EVENT.CONNECTION, async (socket) => {
      this.socket = socket
      this.wsService.afterSeverConnection(socket)
    })
  }

  @SubscribeMessage(SOCKET_EVENT.SEND_MESSAGE)
  async handleSendMessage(@MessageBody() data: SendMessageDto): Promise<Record<string, NestedValidationErrors> | undefined> {
    const [result, errors] = await validateWsBody(SendMessageDto, data)
    if (errors) {
      this.socket.emit(SOCKET_EVENT.ERROR, result)
      return result
    }
    await this.wsService.sendMessage(data)
  }

  @SubscribeMessage(SOCKET_EVENT.READ_MESSAGE)
  async handleReadMessage(@MessageBody() data: { toUser: string }) {
    await this.wsService.readMessage(data)
  }

  @SubscribeMessage(SOCKET_EVENT.JOIN_ROOM)
  async handleJoinGroup(@MessageBody() data: { groupId: string }) {
    const res = await this.socket.join(data.groupId)
    return res
  }

  @SubscribeMessage(SOCKET_EVENT.LOGIN)
  async handleLogin() {
    await this.wsService.login(this.server)
  }
}
