import { Global, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { databaseConfig, emailConfig, redisConfig } from './config'
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
      load: [redisConfig, emailConfig, databaseConfig],
      envFilePath: ['.env', `.env.${getEnv('NODE_ENV')}`],
    }),
  ],
  providers: [PrismaService, RedisFactory],
  exports: [PrismaService, RedisFactory],
})
export class CommonModule {}
