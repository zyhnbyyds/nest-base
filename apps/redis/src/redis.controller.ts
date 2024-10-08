import { Controller } from '@nestjs/common'
import { Ctx, MessagePattern, Payload, RedisContext } from '@nestjs/microservices'
import { MicroServiceMessageEnum } from 'common/common/enums/subapps'

@Controller()
export class RedisController {
  constructor() {}

  @MessagePattern({ cmd: MicroServiceMessageEnum.REDIS_CMD })
  redisCmd(@Payload() data: number[], @Ctx() context: RedisContext) {
    console.log(data, context)
    return 1
  }
}
