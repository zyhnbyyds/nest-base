import { CommonModule } from '@libs/common'
import { MicroServiceNameEnum } from '@libs/common/enums/subapps'
import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { ThrottlerModule } from '@nestjs/throttler'
import { UserModule } from './modules/user/user.module'

@Module({
  imports: [
    UserModule,
    CommonModule,
    ClientsModule.register({
      clients: [
        {
          name: MicroServiceNameEnum.LOGGER_SERVICE,
          transport: Transport.TCP,
          options: {
            port: 3004,
          },
        },
      ],
      isGlobal: true,
    }),
    ThrottlerModule.forRoot(),
  ],
  controllers: [],
  providers: [],
})
export class CoreModule {}
