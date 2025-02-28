import { PrismaService } from '@libs/common/services/prisma.service'
import { filterEmptyParams, transformPageToOrmQry } from '@libs/common/utils/page'
import { Result } from '@libs/common/utils/result'
import { Injectable } from '@nestjs/common'
import { omit } from 'lodash'
import { GetNotificationListDto } from './dto/notification.dto'

@Injectable()
export class NotificationService {
  constructor(private readonly db: PrismaService) {}
  async findAll(query: GetNotificationListDto, userId: string) {
    const queryExcludePage = filterEmptyParams({ ...omit(query, ['current', 'size']), toUserId: userId })

    const [list, count] = await this.db.$transaction([
      this.db.notification.findMany(
        { where: { ...queryExcludePage }, ...transformPageToOrmQry(query), include: { toUser: true } },
      ),
      this.db.notification.count({ where: { ...queryExcludePage } }),
    ])

    return Result.list(list, count)
  }

  async delMany(ids: string[]) {
    await this.db.notification.deleteMany({ where: { notificationId: { in: ids } } })
    Result.ok()
  }
}
