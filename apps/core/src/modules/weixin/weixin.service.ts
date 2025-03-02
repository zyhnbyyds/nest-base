import * as crypto from 'node:crypto'
import { wxReqBaseUrl } from '@libs/common/constant/wx'
import { FactoryName } from '@libs/common/enums/factory'
import { RedisCacheKey } from '@libs/common/enums/redis'
import { WxTokenRes, WxUserListRes } from '@libs/common/types/weixin'
import { HttpService } from '@nestjs/axios'
import { Inject, Injectable, Logger } from '@nestjs/common'
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
  ) {
    this.nats.subscribe('deepseek.chat.completions', {
      callback: (err, msg) => {
        if (err) {
          Logger.error(err)
        }
        if (msg) {
          this.sendMsgToWxUserFromTemplate('VDFZJoT91BiLok0AMERoyTOkAOJRKZ0XMhTj2jZH3kM')
        }
      },
    })

    this.getAccessToken()
  }

  async validateWeiXin(query: {
    signature: string
    timestamp: string
    nonce: string
    echostr: string
  }) {
    const { signature, timestamp, nonce, echostr } = query

    const token = process.env.WEIXIN_TOKEN

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
  async sendMsgToWxUserFromTemplate(templateId: string) {
    const data = await this.getWxUserList()
    if (data) {
      const { data: { openid } } = data
      for (const openId of openid) {
        this.sendMsgToWxUser(openId, templateId)
        this.getWxUserInfo(openId)
      }
    }
  }

  async sendMsgToWxUser(openId: string, templateId: string) {
    const token = await this.redis.get(RedisCacheKey.WxServerToken)
    const msgInfo = {
      touser: openId,
      template_id: templateId,
      topcolor: '#FF0000',
      data: {
        test: {
          value: '您好，您有新的消息',
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

  @Cron('0 0 */1 * * *')
  async getAccessToken() {
    try {
      // test-params
      const params = {
        appid: 'wx9bb1020a9deb640a',
        secret: 'e92615c5994626a21a084d2b198889d3',
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
