import { Injectable } from '@nestjs/common'

@Injectable()
export class NatsService {
  getHello(): string {
    return 'Hello World!'
  }
}
