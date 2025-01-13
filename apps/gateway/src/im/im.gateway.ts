import { SOCKET_NAMESPACE_IM, SOCKET_ORIGIN_EXCLUDE, SOCKET_PING_INTERVAL, SOCKET_PING_TIMEOUT } from '@libs/common/constant'
import { SOCKET_EVENT } from '@libs/common/constant/socket-event'
import { Snowflake } from '@libs/common/utils/snow-flake'
import { NestedValidationErrors, validateWsBody } from '@libs/common/utils/validate'
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { instrument } from '@socket.io/admin-ui'
import { Namespace, Server, Socket } from 'socket.io'
import { CreateRoomDto } from './dto/create-room.dto'
import { AddFriendDto, AdmitAddFriendDto } from './dto/friend.dto'
import { SendMessageDto } from './dto/send-message.dto'
import { ImService } from './im.service'

@WebSocketGateway({
  cors: {
    origin: SOCKET_ORIGIN_EXCLUDE,
    credentials: true,
  },
  pingInterval: SOCKET_PING_INTERVAL,
  pingTimeout: SOCKET_PING_TIMEOUT,
  namespace: SOCKET_NAMESPACE_IM,
})
export class ImGateway {
  @WebSocketServer()
  server: Server

  constructor(
    private readonly wsService: ImService,
  ) {
  }

  afterInit(namespace: Namespace) {
    instrument(namespace.server, { auth: false, mode: 'production' })

    namespace.on(SOCKET_EVENT.CONNECTION, async (socket: Socket) => {
      this.wsService.afterSeverConnection(socket, namespace)
    })
  }

  @SubscribeMessage(SOCKET_EVENT.SEND_MESSAGE)
  async handleSendMessage(@MessageBody() data: SendMessageDto, @ConnectedSocket() socket: Socket): Promise<Record<string, NestedValidationErrors> | undefined> {
    const [result, errors] = await validateWsBody(SendMessageDto, data)
    if (errors) {
      socket.emit(SOCKET_EVENT.ERROR, result)
      return result
    }
    await this.wsService.sendMessage(socket, data)
  }

  @SubscribeMessage(SOCKET_EVENT.READ_MESSAGE)
  async handleReadMessage(@MessageBody() data: { friendId: string }, @ConnectedSocket() socket: Socket) {
    await this.wsService.readMessage(socket, data)
  }

  @SubscribeMessage(SOCKET_EVENT.CREATE_ROOM)
  async handleCreateRoom(@MessageBody() data: CreateRoomDto, @ConnectedSocket() socket: Socket) {
    const [result, errors] = await validateWsBody(CreateRoomDto, data)

    if (errors) {
      socket.emit(SOCKET_EVENT.ERROR, result)
      return result
    }

    const group = await this.wsService.createRoom(socket, data)

    return group
  }

  @SubscribeMessage(SOCKET_EVENT.JOIN_ROOM)
  async handleJoinGroup(@MessageBody() data: { groupId: string }, @ConnectedSocket() socket: Socket) {
    const res = await socket.join(data.groupId)
    return res
  }

  @SubscribeMessage(SOCKET_EVENT.LOGIN)
  async handleLogin(@ConnectedSocket() socket: Socket) {
    const res = await this.wsService.login(socket)
    return res
  }

  @SubscribeMessage(SOCKET_EVENT.HANDLE_FRIEND_ADD)
  async friendAddAdmit(@ConnectedSocket() socket: Socket, @MessageBody() data: AdmitAddFriendDto) {
    return await this.wsService.friendAddAdmit(socket, data)
  }

  @SubscribeMessage(SOCKET_EVENT.SEND_FRIEND_ADD)
  async friendAdd(@ConnectedSocket() socket: Socket, @MessageBody() data: AddFriendDto) {
    return await this.wsService.friendAdd(socket, data)
  }
}
