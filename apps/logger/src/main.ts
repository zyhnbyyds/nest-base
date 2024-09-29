import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { LoggerModule } from './logger.module'

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(LoggerModule, {
    transport: Transport.TCP,
    options: {
      port: 3004,
    },
  })
  await app.listen()
}
bootstrap()
