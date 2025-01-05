import { Module } from '@nestjs/common'
import { ImModule } from './im/im.module'

@Module({
  imports: [ImModule],
})
export class GatewayModule {}
