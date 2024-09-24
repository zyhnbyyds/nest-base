import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server } from 'socket.io'

@WebSocketGateway(3002, {
  cors: {
    origin: '*',
  },
  pingInterval: 2000,
})
export class EventsGateway {
  @WebSocketServer()
  server: Server

  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: { id: number, name: string, message: string }) {
    this.server.emit('message', data.message)
  }
}
