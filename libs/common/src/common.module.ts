import { Global, Module } from '@nestjs/common'
import { PrismaService } from './services/prisma.service'

/**
 * 通用模块
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class CommonModule {}
