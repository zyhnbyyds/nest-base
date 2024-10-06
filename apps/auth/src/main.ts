import { INestApplication } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter } from '@nestjs/platform-fastify'
import { SubAppPortEnum } from 'common/common/enums/subapps'
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
  await app.listen(SubAppPortEnum.Auth)
}
bootstrap()
