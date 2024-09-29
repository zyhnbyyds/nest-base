import { INestApplication, Inject } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter } from '@nestjs/platform-fastify'
import { FastifyInstance } from 'fastify'
import { AuthModule } from './auth.module'

async function bootstrap() {
  const app = await NestFactory.create<INestApplication<FastifyInstance>>(AuthModule, new FastifyAdapter({
    logger: {
      transport: {
        target: '@fastify/one-line-logger',
      },
    },
  }))
  await app.listen(3005)
}
bootstrap()
