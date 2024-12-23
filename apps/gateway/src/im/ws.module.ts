import { CommonModule } from '@libs/common'
import { JwtModuleImport } from '@libs/common/config/module-register'
import { Module } from '@nestjs/common'
import { EventsGateway } from './ws.gateway'
import { WsService } from './ws.service'

@Module({
  imports: [CommonModule, JwtModuleImport],
  providers: [EventsGateway, WsService],
})
export class WsModule {}
