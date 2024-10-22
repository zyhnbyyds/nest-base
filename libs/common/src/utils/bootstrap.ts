import fastifyCsrf from '@fastify/csrf-protection'
import secureSession, { SecureSessionPluginOptions } from '@fastify/secure-session'
import { AllExceptionsFilter } from '@libs/common/filters/all-exceptions.filter'
import { DynamicModule, Logger, Type, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { WinstonModule } from 'nest-winston'
import { natsConfig } from '../config'
import { NatsConfig } from '../config/interface'
import { SubAppPortEnum } from '../enums/subapps'
import { winstonLoggerOptions } from './logger'

export interface BootstrapOptions {
  name: string
  port: number
  prefix?: string
  logger?: boolean
  secureSession?: SecureSessionPluginOptions
  fastifyCsrf?: boolean
  module: Type<any> | DynamicModule | Promise<DynamicModule>
  allExceptionsFilter?: boolean
}

export interface MicroBootstrapOptions {
  name: string
  module: Type<any> | DynamicModule | Promise<DynamicModule>
}

/**
 * common bootstrap runner 通用启动器封装
 * @param options BootstrapOptions 启动配置
 */
export async function bootstrap(options: BootstrapOptions) {
  const app = await NestFactory.create<NestFastifyApplication>(options.module, new FastifyAdapter())

  if (options.allExceptionsFilter)
    app.useGlobalFilters(new AllExceptionsFilter())

  if (options.prefix)
    app.setGlobalPrefix(options.prefix)

  app
    .useGlobalPipes(new ValidationPipe())

  if (options.secureSession)
    await app.register(secureSession, options.secureSession)

  if (options.fastifyCsrf)
    await app.register(fastifyCsrf)

  app.useLogger(WinstonModule.createLogger(winstonLoggerOptions))

  await app.listen({
    port: options.port,
  })

  Logger.log(`App${options.name} running on the ${options.port}`)
}

export async function microBootstrap(options: MicroBootstrapOptions) {
  const { server, user, pass } = natsConfig() as NatsConfig
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(options.module, {
    transport: Transport.NATS,
    options: {
      servers: server,
      timeout: 2000,
      user,
      pass,
    },
  })

  app.useLogger(WinstonModule.createLogger(winstonLoggerOptions))

  await app.listen()
  Logger.log(`Micro-${options.name} running on the nats ${SubAppPortEnum.Nats}`)
}
