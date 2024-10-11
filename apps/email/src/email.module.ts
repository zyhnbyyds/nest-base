import { CommonModule } from '@libs/common'
import { RedisModuleRegister } from '@libs/common/config/module-register'
import { TransportFactory } from '@libs/common/factories/transporter.factory'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ClientsModule } from '@nestjs/microservices'
import { EmailController } from './email.controller'
import { EmailService } from './email.service'

@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.register([
      RedisModuleRegister,
    ]),
    CommonModule,
  ],
  controllers: [EmailController],
  providers: [EmailService, TransportFactory],
})
export class EmailModule {}
