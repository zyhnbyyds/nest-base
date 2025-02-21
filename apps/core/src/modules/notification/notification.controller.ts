import { UserVerify } from '@libs/common/custom-decorators/UserVerify.decorator'
import { TUserVerify } from '@libs/common/types/interface'
import { Controller, Delete, Get, Param, Query } from '@nestjs/common'
import { GetNotificationListDto } from './dto/notification.dto'
import { NotificationService } from './notification.service'

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('/list')
  findAll(@Query() query: GetNotificationListDto, @UserVerify() verify: TUserVerify) {
    return this.notificationService.findAll(query, verify.userId)
  }

  @Delete('/del')
  delMany(@Param('id') id: string) {
    let ids: string[] = []
    if (id) {
      ids = id.split(',')
    }
    return this.notificationService.delMany(ids)
  }
}
