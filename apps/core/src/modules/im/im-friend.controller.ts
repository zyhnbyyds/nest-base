import { FastifyRequestWithAuth } from '@libs/common/types/interface'
import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Req } from '@nestjs/common'
import { AddFriendDto, AdmitAddFriendDto } from './dto/add-friend.dto'
import { ImUserFriendService } from './im-friend.service'

@Controller('/im/friend')
export class ImUserFriendController {
  constructor(private imUserFriendService: ImUserFriendService) {}

  @Get('/list')
  friendList(@Req() req: FastifyRequestWithAuth) {
    return this.imUserFriendService.friendList(req.verify.userId)
  }

  @Get('/list/withUnreadMessageCount')
  findFriendListWithUnreadMessage(@Req() req: FastifyRequestWithAuth) {
    // TODO: implement this use cache
    return this.imUserFriendService.findFriendListWithUnreadMessage(req.verify.userId)
  }

  /**
   * 发送添加好友申请
   */
  @Post('/add')
  @HttpCode(200)
  friendAdd(@Body() body: AddFriendDto, @Req() req: FastifyRequestWithAuth) {
    return this.imUserFriendService.friendAdd(req.verify.userId, body)
  }

  /**
   * 处理好友申请
   * @returns
   */
  @Post('/add/admit')
  @HttpCode(200)
  friendAddAdmit(@Body() body: AdmitAddFriendDto, @Req() req: FastifyRequestWithAuth) {
    return this.imUserFriendService.friendAddAdmit(req.verify.userId, body)
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
