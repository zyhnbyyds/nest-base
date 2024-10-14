import { CommonModule } from '@libs/common'
import { JwtModuleImport } from '@libs/common/config/module-register'
import { MicroServiceNameEnum } from '@libs/common/enums/subapps'
import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
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
    JwtModuleImport,
  ],
})
export class CoreModule {}
