import { SubAppPortEnum } from '@libs/common/enums/subapps'
import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { EmailModule } from './email.module'

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(EmailModule, {
    transport: Transport.TCP,
    options: {
      port: SubAppPortEnum.Email,
    },
  })

  await app.listen()

  Logger.log(`micro-email running on the ${SubAppPortEnum.Email}`)
}
bootstrap()
