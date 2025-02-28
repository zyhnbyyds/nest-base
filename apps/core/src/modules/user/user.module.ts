import { AuthJwtGuard } from '@libs/common/guards/jwt.guard'
import { OAuth2Strategy } from '@libs/common/strategies/oauth2.strategy'
import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { PassportModule } from '@nestjs/passport'
import { ThrottlerModule } from '@nestjs/throttler'
import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
  imports: [
    PassportModule,
    ThrottlerModule.forRoot(
      [
        { ttl: 6000, limit: 10 },
      ],
    ),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: APP_GUARD,
      useClass: AuthJwtGuard,
    },
    OAuth2Strategy,
  ],
})
export class UserModule {}
