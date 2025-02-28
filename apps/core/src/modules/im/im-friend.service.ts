import { ImMessageStatusEnum } from '@libs/common/enums/im'
import { PrismaService } from '@libs/common/services/prisma.service'
import { Result } from '@libs/common/utils/result'
import { Snowflake } from '@libs/common/utils/snow-flake'
import { Injectable } from '@nestjs/common'
import { ImFriend, User } from '@prisma/client'
import { ImErrorMsg } from './config/error'
import { AddFriendDto, AdmitAddFriendDto } from './dto/add-friend.dto'

@Injectable()
export class ImUserFriendService {
  constructor(private db: PrismaService) {}

  async friendList(userId: string) {
    const friends = await this.db.imFriend.findMany({ where: { userId } })
    const friendIds = friends.map(friend => friend.friendId)

    const friendIdToUserMap = new Map<string, User>()
    const friendUserInfoList = await this.db.user.findMany({ where: { userId: { in: friendIds } } })

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

    const friendList = await this.db.imFriend.findMany({
      where: { userId },
    })

    const friendIds = friendList.map(item => item.friendId)

    if (friendIds.length === 0) {
      return Result.success([])
    }

    const unreadCounts = await this.db.imMessage.groupBy({
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

    const friendUserInfoList = await this.db.user.findMany({ where: { userId: { in: friendIds } } })

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

  async friendAdd(userId: string, friendInfo: AddFriendDto) {
    try {
      const { friendId } = friendInfo
      const friend = await this.db.imFriend.findFirst({
        where: {
          userId,
          friendId,
        },
      })

      if (friend) {
        return Result.fail(ImErrorMsg.ImFriendHasExist)
      }

      await this.db.imFriendApply.create({
        data: {
          userId,
          friendId,
          expireAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
          id: (new Snowflake(1, 1)).generateId(),
        },
      })

      return Result.ok()
    }
    catch (error) {
      return Result.fail(error)
    }
  }

  async friendAddAdmit(userId: string, admitInfo: AdmitAddFriendDto) {
    try {
      const { status } = admitInfo
      const applyInfo = await this.db.imFriendApply.findUnique({
        where: {
          id: admitInfo.id,
        },
      })

      if (!applyInfo || (userId !== applyInfo.friendId)) {
        return Result.fail(ImErrorMsg.InvalidFriend)
      }

      if (status === 0) {
        await this.db.imFriend.create({
          data: {
            userId: applyInfo.userId,
            friendId: applyInfo.friendId,
            remark: applyInfo.remark,
            id: (new Snowflake(1, 1)).generateId(),
          },
        })
      }
      else if (status === 1) {
        await this.db.imFriendApply.update({
          where: {
            id: admitInfo.id,
          },
          data: {
            status: 2,
          },
        })
      }
      return Result.ok()
    }
    catch (error) {
      return Result.fail(error)
    }
  }

  async friendDelete(id: string) {
    try {
      await this.db.imFriend.delete({
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
      await this.db.imFriend.update({
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
      await this.db.imFriend.findMany({
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
