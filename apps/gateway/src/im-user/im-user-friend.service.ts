import { MongoService } from '@libs/common/services/prisma.service'
import { Result } from '@libs/common/utils/result'
import { Injectable } from '@nestjs/common'
import { ImUserFriend } from 'packages/mongo'

@Injectable()
export class ImUserFriendService {
  constructor(private mongoService: MongoService) {}

  async friendList() {
    const friends = await this.mongoService.imUserFriend.findMany()
    return Result.success(friends)
  }

  async friendAdd(userId: string, friendId: string) {
    try {
      await this.mongoService.imUserFriend.create({
        data: {
          userId,
          friendId,
        },
      })
      return Result.ok()
    }
    catch (error) {
      return Result.fail(error)
    }
  }

  async friendDelete(id: string) {
    try {
      await this.mongoService.imUserFriend.delete({
        where: {
          id,
        },
      })
    }
    catch (error) {
      return Result.fail(error)
    }
  }

  async friendUpdate(id: string, friendInfo: ImUserFriend) {
    try {
      await this.mongoService.imUserFriend.update({
        where: {
          id,
        },
        data: friendInfo,
      })
    }
    catch (error) {
      return Result.fail(error)
    }
  }

  async friendSearch(searchVal: string) {
    try {
      await this.mongoService.imUserFriend.findMany({
        where: {
          OR: [
            {
              userId: searchVal,
            },
            {
              friendId: searchVal,
            },
            {
              remark: searchVal,
            },
          ],
        },
      })
      return Result.ok()
    }
    catch (error) {
      return Result.fail(error)
    }
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
