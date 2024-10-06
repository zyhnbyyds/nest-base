import { ClientProviderOptions, ClientsModuleOptions, Transport } from '@nestjs/microservices'
import { MicroServiceNameEnum } from '../enums/subapps'

/**
 * 邮件注册模块
 */
export const EmailModuleRegister: ClientProviderOptions = {
  name: MicroServiceNameEnum.EMAIL_SERVICE,
  transport: Transport.TCP,
  options: {
    port: 3006,
    host: 'localhost',
  },
}

/**
 * 日志注册模块
 */
export const LoggerModuleRegister: ClientProviderOptions = {
  name: MicroServiceNameEnum.LOGGER_SERVICE,
  transport: Transport.TCP,
  options: {
    port: 3004,
    host: 'localhost',
  },
}
