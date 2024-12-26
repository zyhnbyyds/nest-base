import { ImMessageStatusEnum } from '@libs/common/enums/im'
import { MongoService, MysqlService } from '@libs/common/services/prisma.service'
import { Result } from '@libs/common/utils/result'
import { Injectable } from '@nestjs/common'
import { ImFriend } from 'packages/mongo'
import { User } from 'packages/mysql'
import { ulid } from 'ulid'
import { ImErrorMsg } from './config/error'

@Injectable()
export class ImUserFriendService {
  constructor(private mongoService: MongoService, private mysqlService: MysqlService) {}

  async friendList(userId: string) {
    const friends = await this.mongoService.imFriend.findMany({ where: { userId } })
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

  async findFriendListWithUnreadMessage(userId: string) {
    const unreadCountMap = new Map<string, number>()
    const friendIdToUserMap = new Map<string, User>()

    const friendList = await this.mongoService.imFriend.findMany({
      where: { userId },
    })

    const friendIds = friendList.map(item => item.friendId)

    if (friendIds.length === 0) {
      return Result.success([])
    }

    const unreadCounts = await this.mongoService.imMessage.groupBy({
      by: ['fromUserId'],
      where: {
        fromUserId: { in: friendIds },
        toUserId: userId,
        status: ImMessageStatusEnum.UNREAD,
      },
      _count: { fromUserId: true },
    })

    unreadCounts.forEach((item) => {
      unreadCountMap.set(item.fromUserId, item._count.fromUserId)
    })

    const friendUserInfoList = await this.mysqlService.user.findMany({ where: { userId: { in: friendIds } } })

    friendUserInfoList.forEach((item) => {
      friendIdToUserMap.set(item.userId, item)
    })

    const friendsWithUserInfo = friendList.map((item) => {
      return {
        ...item,
        unreadCount: unreadCountMap.get(item.friendId) || 0,
        user: friendIdToUserMap.get(item.friendId),
      }
    })

    return Result.success(friendsWithUserInfo)
  }

  async friendAdd(userId: string, friendId: string) {
    try {
      const friend = await this.mongoService.imFriend.findFirstOrThrow({
        where: {
          userId,
          friendId,
        },
      })

      if (friend) {
        return Result.fail(ImErrorMsg.ImFrindHasExist)
      }

      await this.mongoService.imFriend.create({
        data: {
          userId,
          friendId,
          id: ulid(),
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
      await this.mongoService.imFriend.delete({
        where: {
          id,
        },
      })
    }
    catch (error) {
      return Result.fail(error)
    }
  }

  async friendUpdate(id: string, friendInfo: ImFriend) {
    try {
      await this.mongoService.imFriend.update({
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
      await this.mongoService.imFriend.findMany({
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
