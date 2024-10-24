import { FactoryName } from '@libs/common/enums/factory'
import { ImUserStatusEnum } from '@libs/common/enums/im'
import { RedisCacheKey } from '@libs/common/enums/redis'
import { MongoService } from '@libs/common/services/prisma.service'
import { Result } from '@libs/common/utils/result'
import { Inject, Injectable } from '@nestjs/common'
import Redis from 'ioredis'
import { CreateImUserDto } from './dto/create-im-user.dto'

@Injectable()
export class ImUserService {
  constructor(
    private prisma: MongoService,

    @Inject(FactoryName.RedisFactory)
    private redis: Redis,
  ) {}

  async login(userId: string) {
    const findRes = await this.findOne(userId)
    if (findRes.data)
      return findRes
    return await this.create({ userId })
  }

  async logout(userId: string) {
    await this.prisma.imUser.update({ where: { userId }, data: { status: 1, lastActiveAt: new Date() } })

    await this.redis.del(`${RedisCacheKey.SocketId}${userId}`)

    return Result.ok()
  }

  async create(createImUserDto: CreateImUserDto) {
    const imUser = await this.prisma.imUser.create({ data: { ...createImUserDto, status: ImUserStatusEnum.OFFLINE } })
    return Result.success(imUser)
  }

  findAll() {
    return `This action returns all imUser`
  }

  async findOne(userId: string) {
    const imUser = await this.prisma.imUser.findUnique({ where: { userId } })
    return Result.success(imUser)
  }

  remove(id: number) {
    return `This action removes a #${id} imUser`
  }
}
