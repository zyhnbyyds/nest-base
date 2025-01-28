import { FastifyRequestWithAuth } from '@libs/common/types/interface'
import { Controller, Delete, Get, Param, Query, Req } from '@nestjs/common'
import { GetNotificationListDto } from './dto/notification.dto'
import { NotificationService } from './notification.service'

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('/list')
  findAll(@Query() query: GetNotificationListDto, @Req() req: FastifyRequestWithAuth) {
    return this.notificationService.findAll(query, req.verify.userId)
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
