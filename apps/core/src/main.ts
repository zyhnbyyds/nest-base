import { randomBytes } from 'node:crypto'
import fastifyCsrf from '@fastify/csrf-protection'
import secureSession from '@fastify/secure-session'
import { SubAppPortEnum, SubAppRoutePrefixEnum } from '@libs/common/enums/subapps'
import { AllExceptionsFilter } from '@libs/common/filters/all-exceptions.filter'
import { WLogger } from '@libs/common/utils/logger'
import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { CoreModule } from './core.module'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(CoreModule, new FastifyAdapter())

  app.useGlobalFilters(new AllExceptionsFilter())
    .setGlobalPrefix(SubAppRoutePrefixEnum.Core)
    .useGlobalPipes(new ValidationPipe())

  await app.register(secureSession, {
    cookie: {
      path: '/',
    },
    cookieName: 'core-cookie',
    sessionName: 'core-session',
    key: randomBytes(32),
  })

  await app.register(fastifyCsrf)

  await app.listen(SubAppPortEnum.Core)

  WLogger.info(`app-core running on the ${SubAppPortEnum.Core}`)
}
bootstrap()
