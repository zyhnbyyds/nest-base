import { JwtModuleImport } from '@libs/common/config/module-register'
import { Module } from '@nestjs/common'
import { ImUserFriendController } from './im-friend.controller'
import { ImUserFriendService } from './im-friend.service'
import { ImMessageController } from './im-message.controller'
import { ImMessageService } from './im-message.service'
import { ImUserController } from './im-user.controller'
import { ImUserService } from './im-user.service'

@Module({
  imports: [JwtModuleImport],
  controllers: [ImUserController, ImUserFriendController, ImMessageController],
  providers: [ImUserService, ImUserFriendService, ImMessageService],
})
export class ImModule {}
