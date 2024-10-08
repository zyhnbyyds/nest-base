import { Global, Module } from '@nestjs/common'
import { RedisController } from './redis.controller'

@Global()
@Module({
  imports: [],
  controllers: [RedisController],
  providers: [],
})
export class RedisModule {}
