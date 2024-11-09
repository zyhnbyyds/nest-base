import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { AddFriendDto } from './dto/add-friend.dto'
import { ImUserFriendService } from './im-user-friend.service'

@Controller('/im/user/friend')
export class ImUserFriendController {
  constructor(private imUserFriendService: ImUserFriendService) {}

  @Get('/list')
  friendList() {
    return this.imUserFriendService.friendList()
  }

  @Post()
  friendAdd(@Body() body: AddFriendDto) {
    const { userId, friendId } = body
    return this.imUserFriendService.friendAdd(userId, friendId)
  }

  @Delete(':id')
  friendDelete(@Param('id') id: string) {
    return this.imUserFriendService.friendDelete(id)
  }

  @Patch()
  friendUpdate() {
  }

  friendSearch() {
    return 'friendSearch'
  }

  friendGroupList() {
    return 'friendGroupList'
  }

  friendGroupAdd() {
    return 'friendGroupAdd'
  }

  friendGroupDelete() {
    return 'friendGroupDelete'
  }

  friendGroupUpdate() {
    return 'friendGroupUpdate'
  }

  friendGroupMove() {
    return 'friendGroupMove'
  }

  friendGroupMemberList() {
    return 'friendGroupMemberList'
  }

  friendGroupMemberAdd() {
    return 'friendGroupMemberAdd'
  }

  friendGroupMemberDelete() {
    return 'friendGroupMemberDelete'
  }

  friendGroupMemberUpdate() {
    return 'friendGroupMemberUpdate'
  }

  friendGroupMemberSearch() {
    return 'friendGroupMemberSearch'
  }

  friendGroupMemberMove() {
    return 'friendGroupMemberMove'
  }

  friendGroupMemberUpdateStatus() {
    return 'friendGroupMemberUpdateStatus'
  }

  friendGroupMemberUpdateRemark() {
    return 'friendGroupMemberUpdateRemark'
  }

  friendGroupMemberUpdateAlias() {
    return 'friendGroupMemberUpdateAlias'
  }
}
