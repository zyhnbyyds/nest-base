import { Catch, Controller } from '@nestjs/common'
import { EventPattern, Payload } from '@nestjs/microservices'
import { Log } from '@prisma/client'
import { MicroServicesEventEnum } from '@libs/common/enums/subapps'
import { PrismaService } from '@libs/common/services/prisma.service'

@Catch()
@Controller()
export class RecordController {
  constructor(private prismaService: PrismaService) {}
  @EventPattern(MicroServicesEventEnum.WRITE_LOG)
  recordLog(@Payload() payload: Log) {
    return this.prismaService.log.create({ data: payload })
  }
}
