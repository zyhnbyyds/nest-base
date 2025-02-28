import { FactoryName } from '@libs/common/enums/factory'
import { ImMessageStatusEnum, ImUserStatusEnum } from '@libs/common/enums/im'
import { PrismaService } from '@libs/common/services/prisma.service'
import { transformPageToOrmQry } from '@libs/common/utils/page'
import { Result } from '@libs/common/utils/result'
import { Inject, Injectable } from '@nestjs/common'
import Redis from 'ioredis'
import { omit } from 'lodash'
import { CreateImUserDto } from './dto/create-im-user.dto'
import { GetImMessageListDto, ReadMessageDto } from './dto/im-message'

@Injectable()
export class ImMessageService {
  constructor(
    private db: PrismaService,
    @Inject(FactoryName.RedisFactory)
    private redis: Redis,
  ) {}

  async create(createImUserDto: CreateImUserDto) {
    const imUser = await this.db.imUser.create({ data: { ...createImUserDto, status: ImUserStatusEnum.OFFLINE, userName: '' } })
    return Result.success(imUser)
  }

  async findMessageList(query: GetImMessageListDto) {
    try {
      const list = await this.db.imMessage.findMany({ ...transformPageToOrmQry({ ...omit(query, ['friendId']) }), where: { fromUserId: query.friendId } })

      const total = await this.db.imMessage.count({ where: { fromUserId: query.friendId } })
      return Result.list(list, total)
    }
    catch (error) {
      return Result.fail(error)
    }
  }

  async findOne(userId: string) {
    const imUser = await this.db.imUser.findUnique({ where: { userId } })
    return Result.success(imUser)
  }

  remove(id: number) {
    return `This action removes a #${id} imUser`
  }

  async readMessage(body: ReadMessageDto) {
    await this.db.imMessage.updateMany({
      where: {
        ...body,
        status: ImMessageStatusEnum.UNREAD,
      },
      data: {
        status: ImMessageStatusEnum.READ,
      },
    })
    return Result.ok()
  }
}
