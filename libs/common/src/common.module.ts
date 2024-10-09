import { Global, Module } from '@nestjs/common'
import RedisFactory from './factories/redis.factory'
import { PrismaService } from './services/prisma.service'

/**
 * 通用模块
 */
@Global()
@Module({
  providers: [PrismaService, RedisFactory],
  exports: [PrismaService, RedisFactory],
})
export class CommonModule {}
