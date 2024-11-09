import { Module } from '@nestjs/common'
import { ImUserController } from './im-user.controller'
import { ImUserService } from './im-user.service'
import { ImUserFriendController } from './im-user-friend.controller'
import { ImUserFriendService } from './im-user-friend.service'

@Module({
  controllers: [ImUserController, ImUserFriendController],
  providers: [ImUserService, ImUserFriendService],
})
export class ImUserModule {}
