import { Log } from 'packages/mysql'
import { MicroServicesEventEnum } from '@libs/common/enums/subapps'
import { MysqlService } from '@libs/common/services/prisma.service'
import { Catch, Controller } from '@nestjs/common'
import { EventPattern, Payload } from '@nestjs/microservices'

@Catch()
@Controller()
export class RecordController {
  constructor(private mysqlService: MysqlService) {}
  @EventPattern(MicroServicesEventEnum.WRITE_LOG)
  recordLog(@Payload() payload: Log) {
    return this.mysqlService.log.create({ data: payload })
  }
}
