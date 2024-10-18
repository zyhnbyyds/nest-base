import { Global, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { databaseConfig, emailConfig, jwtConfig, redisConfig } from './config'
import RedisFactory from './factories/redis.factory'
import { MysqlService } from './services/prisma.service'
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
    // TODO: fix 修复在微服务调用情况下的rate limit报错
    // ThrottlerModule.forRootAsync({
    //   useFactory() {
    //     const redis = RedisFactory.useFactory()
    //     return {
    //       storage: new ThrottlerStorageRedisService(redis),
    //       throttlers: [
    //         {
    //           limit: 300,
    //           ttl: 20000,
    //         },
    //       ],
    //     }
    //   },
    // }),

    // , { provide: APP_GUARD, useClass: ThrottlerGuard }
  ],
  providers: [MysqlService, RedisFactory],
  exports: [MysqlService, RedisFactory],
})
export class CommonModule {}
