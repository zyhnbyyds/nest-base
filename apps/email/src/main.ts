import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { SubAppPortEnum } from 'common/common/enums/subapps'
import { EmailModule } from './email.module'

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(EmailModule, {
    transport: Transport.TCP,
    options: {
      port: SubAppPortEnum.Email,
    },
  })

  await app.listen()
}
bootstrap()
