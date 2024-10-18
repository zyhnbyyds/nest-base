import { Module } from '@nestjs/common'
import { ImUserController } from './im-user.controller'
import { ImUserService } from './im-user.service'

@Module({
  controllers: [ImUserController],
  providers: [ImUserService],
})
export class ImUserModule {}
