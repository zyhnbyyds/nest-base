import { MongoService, MysqlService } from '@libs/common/services/prisma.service'
import { Result } from '@libs/common/utils/result'
import { Injectable } from '@nestjs/common'
import { ImUserFriend } from 'packages/mongo'
import { User } from 'packages/mysql'

@Injectable()
export class ImUserFriendService {
  constructor(private mongoService: MongoService, private mysqlService: MysqlService) {}

  async friendList(userId: string) {
    const friends = await this.mongoService.imUserFriend.findMany({ where: { userId } })
    const friendIds = friends.map(friend => friend.friendId)

    const friendIdToUserMap = new Map<string, User>()
    const friendUserInfoList = await this.mysqlService.user.findMany({ where: { userId: { in: friendIds } } })

    friendUserInfoList.forEach((item) => {
      friendIdToUserMap.set(item.userId, item)
    })

    const friendsWithUserInfo = friends.map((item) => {
      return {
        ...item,
        user: friendIdToUserMap.get(item.friendId),
      }
    })

    return Result.success(friendsWithUserInfo)
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
