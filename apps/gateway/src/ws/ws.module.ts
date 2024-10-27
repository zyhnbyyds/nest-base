import { CommonModule } from '@libs/common'
import { JwtModuleImport } from '@libs/common/config/module-register'
import { Module } from '@nestjs/common'
import { ImUserService } from '../im-user/im-user.service'
import { EventsGateway } from './ws.gateway'
import { WsService } from './ws.service'

@Module({
  imports: [CommonModule, JwtModuleImport],
  providers: [EventsGateway, ImUserService, WsService],
})
export class WsModule {}
