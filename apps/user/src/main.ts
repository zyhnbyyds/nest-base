import { NestFactory } from '@nestjs/core'
import { FastifyAdapter } from '@nestjs/platform-fastify'
import { UserModule } from './user.module'

async function bootstrap() {
  const app = await NestFactory.create(UserModule, new FastifyAdapter())
  await app.listen(3003)
}
bootstrap()
