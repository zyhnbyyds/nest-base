import { Module } from '@nestjs/common'
import { WsModule } from './im/ws.module'

@Module({
  imports: [WsModule],
  controllers: [],
  providers: [],
})
export class GatewayModule {}
