import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { SubAppPortEnum } from 'common/common/enums/subapps'
import { LoggerModule } from './logger.module'

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(LoggerModule, {
    transport: Transport.TCP,
    options: {
      port: SubAppPortEnum.Logger,
    },
  })
  await app.listen()
}
bootstrap()
