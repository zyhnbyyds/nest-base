import { Public } from '@libs/common/guards/public.guard'
import {
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common'
import { WeixinService } from './weixin.service'

@Controller('weixin')
export class WeixinController {
  constructor(private readonly weixinService: WeixinService) {}

  @Public()
  @Get('/validateWxServer')
  @Header('Content-Type', 'text/plain')
  @HttpCode(HttpStatus.OK)
  async validateWxServer(
    @Query()
    query: {
      signature: string
      timestamp: string
      nonce: string
      echostr: string
    },
  ) {
    const echostr = await this.weixinService.validateWeiXin(query)

    return echostr
  }

  @Public()
  @Get('/test')
  async test() {
    const testTemplate = process.env.WX_TEST_TEMPLATE_ID
    await this.weixinService.sendMsgToWxUserFromTemplate(testTemplate)
    return 'ok'
  }
}
