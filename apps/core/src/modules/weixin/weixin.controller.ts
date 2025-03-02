import {
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common'
import { WeixinService } from './weixin.service'

@Controller('weixin')
export class WeixinController {
  constructor(private readonly weixinService: WeixinService) {}

  @Get('/validateWxServer')
  async validateWxServer(
    @Query()
    query: {
      signature: string
      timestamp: string
      nonce: string
      echostr: string
    },
    @Res() res: any,
  ) {
    const echostr = await this.weixinService.validateWeiXin(query)
    res
      .status(HttpStatus.OK)
      .setHeader('Content-Type', 'text/plain')
      .send(echostr)
  }

  @Get('/test')
  async test() {
    this.weixinService.sendMsgToWxUserFromTemplate('VDFZJoT91BiLok0AMERoyTOkAOJRKZ0XMhTj2jZH3kM')
  }
}
