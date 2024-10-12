import { CacheModule } from '@nestjs/cache-manager'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { ClientProviderOptions, Transport } from '@nestjs/microservices'
import { LocalHost, MicroServiceNameEnum, SubAppPortEnum } from '../enums/subapps'
import { AuthConfig } from './interface'

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

// 动态模块
/**
 * JWT注册
 */
export const JwtModuleImport = JwtModule.registerAsync({
  imports: [ConfigModule],
  global: true,
  useFactory: (configService: ConfigService) => {
    const { secret, expiresIn } = configService.get<AuthConfig>('jwt')
    return {
      secret,
      signOptions: {
        expiresIn,
      },
    }
  },
  inject: [ConfigService],
})
