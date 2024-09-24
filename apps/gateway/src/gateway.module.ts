import { Module } from '@nestjs/common'
import { GatewayController } from './gateway.controller'
import { GatewayService } from './gateway.service'
import { WsModule } from './ws.module'

@Module({
  imports: [WsModule],
  controllers: [GatewayController],
  providers: [GatewayService],
})
export class GatewayModule {}
