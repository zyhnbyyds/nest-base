import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { CommonModule } from 'common/common'
import { UserModule } from './modules/user/user.module'

@Module({
  imports: [UserModule, CommonModule, ClientsModule.register({
    clients: [
      {
        name: 'LOGGER_SERVICE',
        transport: Transport.TCP,
        options: {
          port: 3004,
        },
      },
    ],
    isGlobal: true,
  })],
  controllers: [],
  providers: [],
})
export class CoreModule {}
