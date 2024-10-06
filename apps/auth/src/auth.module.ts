import { Module } from '@nestjs/common'
import { ClientsModule } from '@nestjs/microservices'
import { CommonModule } from 'common/common'
import { EmailModuleRegister, LoggerModuleRegister } from 'common/common/config/module-register'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
  imports: [
    CommonModule,
    ClientsModule.register([
      EmailModuleRegister,
      LoggerModuleRegister,
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
