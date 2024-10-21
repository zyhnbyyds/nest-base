import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { NatsModule } from './nats.module'

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(NatsModule, {
    transport: Transport.NATS,
    options: {
      servers: ['nats://localhost:4222'],
    },
  })
  await app.listen()
}
bootstrap()
