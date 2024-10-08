import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ClientsModule } from '@nestjs/microservices'
import { RedisModuleRegister } from 'common/common/config/module-register'
import { EmailController } from './email.controller'
import { EmailService } from './email.service'

@Module({
  imports: [ConfigModule.forRoot(), ClientsModule.register([
    RedisModuleRegister,
  ])],
  controllers: [EmailController],
  providers: [EmailService],
})
export class EmailModule {}
