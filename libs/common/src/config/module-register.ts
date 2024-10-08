import { CacheModule } from '@nestjs/cache-manager'
import { ClientProviderOptions, Transport } from '@nestjs/microservices'
import { LocalHost, MicroServiceNameEnum, SubAppPortEnum } from '../enums/subapps'

/**
 * 邮件注册模块
 */
export const EmailModuleRegister: ClientProviderOptions = {
  name: MicroServiceNameEnum.EMAIL_SERVICE,
  transport: Transport.TCP,
  options: {
    port: SubAppPortEnum.Email,
  },
}

/**
 * 日志注册模块
 */
export const LoggerModuleRegister: ClientProviderOptions = {
  name: MicroServiceNameEnum.LOGGER_SERVICE,
  transport: Transport.TCP,
  options: {
    port: SubAppPortEnum.Logger,
  },
}

/**
 * Redis本地调用注册
 */
export const RedisCacheModuleRegister = CacheModule.register()

/**
 * Redis微服务调用注册
 */
export const RedisModuleRegister: ClientProviderOptions = {
  name: MicroServiceNameEnum.REDIS_SERVICE,
  transport: Transport.REDIS,
  options: {
    port: SubAppPortEnum.Redis,
    host: LocalHost,
  },
}
