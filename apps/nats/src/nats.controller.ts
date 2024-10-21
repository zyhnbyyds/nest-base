import { Controller, Get } from '@nestjs/common'
import { NatsService } from './nats.service'

@Controller()
export class NatsController {
  constructor(private readonly natsService: NatsService) {}

  @Get()
  getHello(): string {
    return this.natsService.getHello()
  }
}
