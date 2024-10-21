import { Module } from '@nestjs/common'
import { NatsController } from './nats.controller'
import { NatsService } from './nats.service'

@Module({
  imports: [],
  controllers: [NatsController],
  providers: [NatsService],
})
export class NatsModule {}
