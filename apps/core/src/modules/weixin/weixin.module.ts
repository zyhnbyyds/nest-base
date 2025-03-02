import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { WeixinController } from './weixin.controller'
import { WeixinService } from './weixin.service'

@Module({
  imports: [HttpModule],
  controllers: [WeixinController],
  providers: [WeixinService],
})
export class WeixinModule {}
