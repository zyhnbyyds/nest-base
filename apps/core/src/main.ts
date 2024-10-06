import { INestApplication } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter } from '@nestjs/platform-fastify'
import { SubAppPortEnum } from 'common/common/enums/subapps'
import { FastifyInstance } from 'fastify'
import { CoreModule } from './core.module'

async function bootstrap() {
  const app = await NestFactory.create<INestApplication<FastifyInstance>>(CoreModule, new FastifyAdapter({
    logger: {
      transport: {
        target: '@fastify/one-line-logger',
      },
    },
    prefix: '/core',
  }))
  await app.listen(SubAppPortEnum.Core)
}
bootstrap()
