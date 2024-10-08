import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { SubAppPortEnum } from 'common/common/enums/subapps'
import { RedisModule } from './redis.module'

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(RedisModule, {
    transport: Transport.REDIS,
    options: {
      port: SubAppPortEnum.Redis,
    },
  })
  await app.listen()
}
bootstrap()
