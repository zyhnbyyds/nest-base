import { CommonModule } from '@libs/common'
import { JwtModuleImport } from '@libs/common/config/module-register'
import { Module } from '@nestjs/common'
import { ImGateway } from './im.gateway'
import { ImService } from './im.service'

@Module({
  imports: [CommonModule, JwtModuleImport],
  providers: [ImGateway, ImService],
})
export class ImModule {}
