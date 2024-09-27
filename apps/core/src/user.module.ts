import { Module } from '@nestjs/common'
import { CommonModule } from 'common/common'
import { UserModule } from './user/user.module'

@Module({
  imports: [UserModule, CommonModule],
  controllers: [],
  providers: [],
})
export class CoreModule {}
