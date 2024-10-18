import { SubAppPortEnum } from '@libs/common/enums/subapps'
import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { LoggerModule } from './logger.module'

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(LoggerModule, {
    transport: Transport.TCP,
    options: {
      port: SubAppPortEnum.Logger,
    },
  })
  await app.listen()
  Logger.log(`micro-logger running on the ${SubAppPortEnum.Logger}`)
}
bootstrap()
