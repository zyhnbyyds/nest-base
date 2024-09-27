import { NestFactory } from '@nestjs/core'
import { FastifyAdapter } from '@nestjs/platform-fastify'
import { CoreModule } from './user.module'

async function bootstrap() {
  const app = await NestFactory.create(CoreModule, new FastifyAdapter())
  await app.listen(3003)
}
bootstrap()
