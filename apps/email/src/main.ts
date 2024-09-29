import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { EmailModule } from './email.module'

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(EmailModule, {
    transport: Transport.TCP,
    options: {
      port: 3006,
    },
  })
  await app.listen()
}
bootstrap()
