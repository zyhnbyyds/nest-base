import { JwtModuleImport } from '@libs/common/config/module-register'
import { Module } from '@nestjs/common'
import { ImUserFriendController } from './im-user-friend.controller'
import { ImUserFriendService } from './im-user-friend.service'
import { ImUserController } from './im-user.controller'
import { ImUserService } from './im-user.service'

@Module({
  imports: [JwtModuleImport],
  controllers: [ImUserController, ImUserFriendController],
  providers: [ImUserService, ImUserFriendService],
})
export class ImUserModule {}
