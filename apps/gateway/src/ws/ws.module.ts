import { CommonModule } from '@libs/common'
import { JwtModuleImport } from '@libs/common/config/module-register'
import { Module } from '@nestjs/common'
import { EventsGateway } from './ws.gateway'

@Module({
  imports: [CommonModule, JwtModuleImport],
  providers: [EventsGateway],
})
export class WsModule {}
