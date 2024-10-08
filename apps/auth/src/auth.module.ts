import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ClientsModule } from '@nestjs/microservices'
import { CommonModule } from 'common/common'
import { EmailModuleRegister, LoggerModuleRegister, RedisCacheModuleRegister, RedisModuleRegister } from 'common/common/config/module-register'
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
    RedisCacheModuleRegister,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
