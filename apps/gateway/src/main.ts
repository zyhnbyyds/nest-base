import { NestFactory } from '@nestjs/core'
import { FastifyAdapter } from '@nestjs/platform-fastify'
import { GatewayModule } from './gateway.module'

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule, new FastifyAdapter())
  await app.listen(3000)
}
bootstrap()
