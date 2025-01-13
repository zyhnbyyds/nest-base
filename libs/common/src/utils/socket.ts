import { Inject } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import Redis from 'ioredis'
import ms, { StringValue } from 'ms'
import { Namespace, Socket } from 'socket.io'
import { AuthConfig } from '../config/interface'
import { SOCKET_EVENT } from '../constant/socket-event'
import { FactoryName } from '../enums/factory'
import { ImUserStatusEnum } from '../enums/im'
import { RedisCacheKey } from '../enums/redis'
import { MongoService } from '../services/prisma.service'

export class SocketAfterSeverConnection {
  constructor(
    private mongoService: MongoService,
    private jwtService: JwtService,

    @Inject(FactoryName.RedisFactory)
    private redis: Redis,

    private configService: ConfigService,
  ) {}

  async afterSeverConnection(socket: Socket, namespace: Namespace) {
    const { token, userId } = socket.handshake.auth as { token: string, userId: string }

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
        namespace.sockets.get(cacheSocketId)?.disconnect()
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
}
