import { Module } from '@nestjs/common'
import { ThrottlerModule } from '@nestjs/throttler'
import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
  imports: [ThrottlerModule.forRoot(
    [
      { ttl: 6000, limit: 10 },
    ],
  )],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
