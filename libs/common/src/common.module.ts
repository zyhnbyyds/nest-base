import { Global, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { databaseConfig, emailConfig, jwtConfig, redisConfig } from './config'
import RedisFactory from './factories/redis.factory'
import { PrismaService } from './services/prisma.service'
import { getEnv } from './utils/env'

/**
 * Common module 通用模块
 */
@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [redisConfig, emailConfig, databaseConfig, jwtConfig],
      envFilePath: ['.env', `.env.${getEnv('NODE_ENV')}`],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 10000,
        limit: 3,
      },
    ]),
  ],
  providers: [PrismaService, RedisFactory, { provide: APP_GUARD, useClass: ThrottlerGuard }],
  exports: [PrismaService, RedisFactory],
})
export class CommonModule {}
