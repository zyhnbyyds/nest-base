import { Injectable, Logger } from '@nestjs/common'
import { Interval } from '@nestjs/schedule'

@Injectable()
export class TasksService {
  @Interval(3000)
  handleCron() {
    Logger.log('Called every 3 seconds')
  }
}
