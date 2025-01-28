import { AuthConfig } from '@libs/common/config/interface'
import { SOCKET_EVENT } from '@libs/common/constant/socket-event'
import { FactoryName } from '@libs/common/enums/factory'
import { ImMessageStatusEnum, ImUserStatusEnum } from '@libs/common/enums/im'
import { NotificationTitle } from '@libs/common/enums/notification'
import { RedisCacheKey } from '@libs/common/enums/redis'
import { MongoService, MysqlService } from '@libs/common/services/prisma.service'
import { Result } from '@libs/common/utils/result'
import { Snowflake } from '@libs/common/utils/snow-flake'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { ImErrorMsg } from 'apps/core/src/modules/im/config/error'
import { format } from 'date-fns'
import Redis from 'ioredis'
import ms, { StringValue } from 'ms'
import { NotificationType } from 'packages/mysql'
import { Namespace, Socket } from 'socket.io'
import { ulid } from 'ulid'
import { CreateRoomDto } from './dto/create-room.dto'
import { AddFriendDto, AdmitAddFriendDto } from './dto/friend.dto'
import { SendMessageDto } from './dto/send-message.dto'

@Injectable()
export class ImService {
  private server: Namespace
  constructor(
    private mongoService: MongoService,
    private jwtService: JwtService,
    private mysqlService: MysqlService,

    @Inject(FactoryName.RedisFactory)
    private redis: Redis,

    private configService: ConfigService,
  ) {
  }

  // TODO: add message validation to send before sending(now me to anyone but not friend)
  async sendMessage(socket: Socket, data: SendMessageDto) {
    const userId = socket.handshake.auth.userId
    if (!userId) {
      socket.emit('error', 'login-first')
      return false
    }

    const socketId = await this.redis.get(`${RedisCacheKey.SocketId}${data.toUser}`)

    const fromUserInfo = await this.mysqlService.user.findUnique({ where: { userId } })

    const messageInfo = {
      content: data.content,
      fromUser: fromUserInfo,
      toUser: data.toUser,
      messageType: data.messageType,
    }

    await this.mongoService.imMessage.create({
      data: {
        messageId: ulid(),
        content: data.content,
        fromUserId: userId,
        toUserId: data.toUser,
        status: ImMessageStatusEnum.UNREAD,
      },
    })
    if (socketId) {
      await this.server.to(socketId).emitWithAck(SOCKET_EVENT.RECEIVE_MESSAGE, messageInfo)
      return true
    }
    return false
  }

  async readMessage(socket: Socket, data: { friendId: string }) {
    const userId = socket.handshake.auth.userId

    await this.mongoService.imMessage.updateMany({
      data: {
        status: ImMessageStatusEnum.READ,
      },
      where: {
        toUserId: userId,
        fromUserId: data.friendId,
        status: ImMessageStatusEnum.UNREAD,
      },
    })

    socket.emit(SOCKET_EVENT.FRIEND_READ_MESSAGE, data.friendId)
  }

  async login(socket: Socket) {
    try {
      const userId = socket.handshake.auth.userId
      if (!userId) {
        return Result.fail()
      }

      let data = await this.mongoService.imUser.findUnique({ where: { userId } })
      if (!data) {
        data = await this.mongoService.imUser.create({ data: { userId, status: ImUserStatusEnum.ONLINE, userName: '' } })
      }

      const updateInfo = await this.mongoService.imUser.update({ data: { status: ImUserStatusEnum.ONLINE }, where: { userId: data.userId } })
      await this.redis.set(`${RedisCacheKey.SocketId}${userId}`, socket.id)

      return Result.success(updateInfo)
    }
    catch (error) {
      socket.emit('error', error)
      return Result.fail(error)
    }
  }

  async afterSeverConnection(socket: Socket, server: Namespace) {
    const { token, userId } = socket.handshake.auth as { token: string, userId: string }
    this.server = server

    if (!token) {
      socket.emit(SOCKET_EVENT.ERROR, 'authentication error')
      socket.disconnect()
    }
    try {
      const payload = await this.jwtService.verifyAsync<{
        userId: string
        email: string
      }>(token)

      const cacheSocketId = await this.redis.get(`${RedisCacheKey.SocketId}${payload.userId}`)
      const cacheToken = await this.redis.get(`${RedisCacheKey.AuthToken}${payload.userId}`)

      // 如果缓存的socketId和token不一致，那么就踢掉之前的socket
      const { expiresIn } = this.configService.get<AuthConfig>('jwt')
      if (cacheSocketId && cacheToken && (cacheSocketId !== socket.id || cacheToken !== token)) {
        await this.redis.set(`${RedisCacheKey.SocketId}${payload.userId}`, socket.id)
        await this.redis.set(`${RedisCacheKey.AuthToken}${userId}`, token, 'PX', ms(expiresIn as StringValue))
        server.sockets.get(cacheSocketId)?.disconnect()
      }
      else if (!cacheSocketId) {
        await this.redis.set(`${RedisCacheKey.SocketId}${payload.userId}`, socket.id)
      }
    }

    // eslint-disable-next-line unused-imports/no-unused-vars
    catch (_error) {
      socket.emit(SOCKET_EVENT.ERROR, 'authentication error')
      socket.disconnect()
    }
    socket.emit(SOCKET_EVENT.READY)

    socket.on(SOCKET_EVENT.DISCONNECT, async () => {
      const imUserInfo = await this.mongoService.imUser.findUnique({ where: { userId } })
      if (!imUserInfo) {
        await this.mongoService.imUser.create({ data: { status: ImUserStatusEnum.OFFLINE, userName: '', userId } })
      }
      else {
        await this.mongoService.imUser.update({ data: { status: ImUserStatusEnum.OFFLINE }, where: { userId } })
      }
      this.redis.del(`${RedisCacheKey.SocketId}${userId}`)
    })
  }

  async createRoom(socket: Socket, body: CreateRoomDto) {
    const { userId } = socket.handshake.auth
    const res = await this.mongoService.imGroup.create({
      data: {
        ...body,
        createdBy: userId,
        groupId: new Snowflake(1, 1).generateId(),
        masterId: userId,
      },
    })

    // const joinInfo = await this.socket.join(res.groupId)
    // console.log(joinInfo, this.socket.rooms)
    return res
  }

  /**
   * 处理好友申请
   * @param admitInfo
   * @returns
   */
  async friendAddAdmit(socket: Socket, admitInfo: AdmitAddFriendDto) {
    const userId = socket.handshake.auth.userId
    try {
      const { status } = admitInfo
      const applyInfo = await this.mongoService.imFriendApply.findUnique({
        where: {
          id: admitInfo.id,
        },
      })

      if (!applyInfo || (userId !== applyInfo.friendId)) {
        return Result.fail(ImErrorMsg.InvalidFriend)
      }

      // 申请过期了
      if (Number.parseInt(format(applyInfo.expireAt, 'T')) < Number.parseInt(format(new Date(), 'T'))) {
        return Result.fail(ImErrorMsg.FriendAddExpired)
      }

      if (status === 0) {
        const socketId = await this.redis.get(`${RedisCacheKey.SocketId}${applyInfo.friendId}`)

        const notification = await this.mysqlService.notification.create({
          data: {
            notificationId: (new Snowflake(1, 1)).generateId(),
            title: `${1}${NotificationTitle.FriendAddAdmit}`,
            notificationType: NotificationType.APPLY_RESULT,
            toUserId: applyInfo.friendId,
            from: applyInfo.userId,
          },
        })

        this.server.to(socketId).emit(SOCKET_EVENT.NOTIFICATION, notification)

        await this.mongoService.imFriend.create({
          data: {
            userId: applyInfo.userId,
            friendId: applyInfo.friendId,
            remark: applyInfo.remark,
            id: (new Snowflake(1, 1)).generateId(),
          },
        })
      }
      else if (status === 1) {
        await this.mongoService.imFriendApply.update({
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

  async friendAdd(socket: Socket, friendInfo: AddFriendDto) {
    try {
      const userId = socket.handshake.auth.userId

      const { friendId } = friendInfo
      const friend = await this.mongoService.imFriend.findFirst({
        where: {
          userId,
          friendId,
        },
      })

      if (friend) {
        return Result.fail(ImErrorMsg.ImFriendHasExist)
      }

      const applyRecord = await this.mongoService.imFriendApply.findFirst({
        where: {
          userId,
          friendId,
        },
      })

      if (applyRecord) {
        return Result.fail(ImErrorMsg.FriendAddApplyIsExist)
      }

      const socketId = await this.redis.get(`${RedisCacheKey.SocketId}${friendId}`)
      const notification = await this.mysqlService.notification.create({
        data: {
          notificationId: (new Snowflake(1, 1)).generateId(),
          title: NotificationTitle.FriendAdd,
          notificationType: NotificationType.APPLY,
          toUserId: friendId,
          from: userId,
        },
      })

      this.server.to(socketId).emit(SOCKET_EVENT.NOTIFICATION, notification)

      await this.mongoService.imFriendApply.create({
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
      Logger.error(error)
      return Result.fail(error)
    }
  }
}
