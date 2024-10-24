import { CacheModule } from '@nestjs/cache-manager'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { ClientProviderOptions, Transport } from '@nestjs/microservices'
import { NATS_TIMEOUT } from '../constant'
import { LocalHost, MicroServiceNameEnum, SubAppPortEnum } from '../enums/subapps'
import { customValidateEnv } from '../utils/env'
import { AuthConfig } from './interface'

const { NATS_SERVER_URL: server, NATS_AUTH_USER: user, NATS_AUTH_PASSWORD: pass } = customValidateEnv(process.env)

/**
 * 邮件注册模块
 */
export const EmailModuleRegister: ClientProviderOptions = {
  name: MicroServiceNameEnum.EMAIL_SERVICE,
  transport: Transport.NATS,
  options: {
    servers: server,
    timeout: NATS_TIMEOUT,
    user,
    pass,
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
