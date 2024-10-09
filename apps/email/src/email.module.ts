import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ClientsModule } from '@nestjs/microservices'
import { CommonModule } from 'common/common'
import { RedisModuleRegister } from 'common/common/config/module-register'
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
  providers: [EmailService],
})
export class EmailModule {}
