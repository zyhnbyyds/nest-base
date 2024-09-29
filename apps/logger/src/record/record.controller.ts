import { Catch, Controller } from '@nestjs/common'
import { EventPattern, Payload } from '@nestjs/microservices'
import { Log } from '@prisma/client'
import { PrismaService } from 'common/common/services/prisma.service'

@Catch()
@Controller()
export class RecordController {
  constructor(private prismaService: PrismaService) {}
  @EventPattern('record_log')
  recordLog(@Payload() payload: Log) {
    return this.prismaService.log.create({ data: payload })
  }
}
