import { SubAppPortEnum } from '@libs/common/enums/subapps'
import { WLogger } from '@libs/common/utils/logger'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter } from '@nestjs/platform-fastify'
import { FastifyInstance } from 'fastify'
import { AuthModule } from './auth.module'

async function bootstrap() {
  const app = await NestFactory.create<INestApplication<FastifyInstance>>(AuthModule, new FastifyAdapter())
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(SubAppPortEnum.Auth)
  WLogger.info(`AppAuth running on the ${SubAppPortEnum.Auth} . . .`)
}
bootstrap()
