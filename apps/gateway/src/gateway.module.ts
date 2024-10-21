import { CommonModule } from '@libs/common'
import { Module } from '@nestjs/common'
import { ImUserModule } from './im-user/im-user.module'
import { WsModule } from './ws/ws.module'

@Module({
  imports: [WsModule, ImUserModule, CommonModule],
  controllers: [],
  providers: [],
})
export class GatewayModule {}
