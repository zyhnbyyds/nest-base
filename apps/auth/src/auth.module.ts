import { CommonModule } from '@libs/common'
import { EmailModuleRegister, LoggerModuleRegister, RedisModuleRegister } from '@libs/common/config/module-register'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ClientsModule } from '@nestjs/microservices'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
  imports: [
    ConfigModule.forRoot(),
    CommonModule,
    ClientsModule.register([
      EmailModuleRegister,
      LoggerModuleRegister,
      RedisModuleRegister,
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
