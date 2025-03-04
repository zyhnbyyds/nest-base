import * as crypto from 'node:crypto'
import { WxConfig } from '@libs/common/config/interface'
import { wxReqBaseUrl } from '@libs/common/constant/wx'
import { FactoryName } from '@libs/common/enums/factory'
import { RedisCacheKey } from '@libs/common/enums/redis'
import { WxTokenRes, WxUserListRes } from '@libs/common/types/weixin'
import { HttpService } from '@nestjs/axios'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Cron } from '@nestjs/schedule'
import Redis from 'ioredis'
import { NatsConnection } from 'nats'
import { lastValueFrom } from 'rxjs'

@Injectable()
export class WeixinService {
  constructor(
    @Inject(FactoryName.NatsFactory)
    private nats: NatsConnection,
    private axios: HttpService,
    @Inject(FactoryName.RedisFactory)
    private redis: Redis,
    private config: ConfigService,
  ) {
    this.nats.subscribe('deepseek.chat.completions', {
      callback: (err, msg) => {
        if (err) {
          Logger.error(err)
        }
        if (msg) {
          const { templateId } = this.config.get<WxConfig>('wx')
          this.sendMsgToWxUserFromTemplate(templateId, msg.data.toString())
        }
      },
    })
  }

  async validateWeiXin(query: {
    signature: string
    timestamp: string
    nonce: string
    echostr: string
  }) {
    const { signature, timestamp, nonce, echostr } = query
    const { token } = this.config.get<WxConfig>('wx')

    const hash = crypto
      .createHash('sha1')
      .update([token, timestamp, nonce].sort().join(''))
      .digest('hex')
    if (signature === hash) {
      Logger.log(`校验成功 ${Number(echostr)}, ${echostr}`)
      return echostr
    }
    else {
      return '校验失败'
    }
  }

  /**
   * 根据模板信息发送消息
   */
  async sendMsgToWxUserFromTemplate(templateId: string, msg: string = '') {
    const data = await this.getWxUserList()
    if (data) {
      const { data: { openid } } = data
      for (const openId of openid) {
        this.sendMsgToWxUser(openId, templateId, msg)
        this.getWxUserInfo(openId)
      }
    }
  }

  async sendMsgToWxUser(openId: string, templateId: string, message: string) {
    const token = await this.redis.get(RedisCacheKey.WxServerToken)
    const msgInfo = {
      touser: openId,
      template_id: templateId,
      topcolor: '#FF0000',
      data: {
        test: {
          value: message,
          color: '#173177',
        },
      },
    }
    try {
      const { data } = await lastValueFrom(this.axios.post(`${wxReqBaseUrl}message/template/send?access_token=${token}`, msgInfo))
      if (data) {
        return true
      }
    }
    catch (err) {
      Logger.error(err)
      return false
    }
  }

  async getWxUserInfo(openid: string) {
    const { data } = await lastValueFrom(this.axios.get(`${wxReqBaseUrl}user/info`, {
      params: {
        access_token: await this.redis.get(RedisCacheKey.WxServerToken),
        openid,
        lang: 'zh_CN',
      },
    }))
    return data
  }

  async getWxUserList() {
    try {
      const params = {
        access_token: await this.redis.get(RedisCacheKey.WxServerToken),
        next_openid: '',
      }
      const res = await lastValueFrom(this.axios.get<WxUserListRes>(`${wxReqBaseUrl}user/get`, { params }))
      if (res) {
        return res.data
      }
    }
    catch (error) {
      Logger.log(error)
      return null
    }
  }

  @Cron('0 0 8 * * *')
  async getAccessToken() {
    try {
      const { appid, secret } = this.config.get<WxConfig>('wx')

      const params = {
        appid,
        secret,
        grant_type: 'client_credential',
      }
      const { data } = await lastValueFrom(this.axios.get<WxTokenRes>(`${wxReqBaseUrl}token`, { params, method: 'GET' }))

      if (data) {
        await this.redis.set(RedisCacheKey.WxServerToken, data.access_token)
        await this.redis.set(RedisCacheKey.WxServerTokenExpire, data.expires_in)
      }
      return true
    }
    catch (error) {
      Logger.log(error)
      return false
    }
  }
}
