import { CommonModule } from '@libs/common'
import { EmailModuleRegister, JwtModuleImport, RedisModuleRegister } from '@libs/common/config/module-register'
import { TimeZoneMiddleware } from '@libs/common/middlewares/timezone.middleware'
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ClientsModule } from '@nestjs/microservices'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
  imports: [
    CommonModule,
    ClientsModule.register([
      EmailModuleRegister,
      RedisModuleRegister,
    ]),
    JwtModuleImport,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TimeZoneMiddleware).forRoutes('*path')
  }
}
