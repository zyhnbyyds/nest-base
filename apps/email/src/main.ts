import { SubAppPortEnum } from '@libs/common/enums/subapps'
import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { EmailModule } from './email.module'

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(EmailModule, {
    transport: Transport.NATS,
    options: {
      servers: 'nats://localhost:4222',
    },
  })

  await app.listen()

  Logger.log(`micro-email running on the ${SubAppPortEnum.Nats}`)
}
bootstrap()
