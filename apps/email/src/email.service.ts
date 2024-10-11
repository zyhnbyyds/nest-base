import { EMAIL_CODE_EXPIRE_TIME } from '@libs/common/config/constant'
import { FactoryName } from '@libs/common/enums/factory'
import { MicroServiceNameEnum } from '@libs/common/enums/subapps'
import { combineEmailOptions } from '@libs/common/utils/email'
import { Inject, Injectable } from '@nestjs/common'
import Redis from 'ioredis'
import { Transporter } from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'

@Injectable()
export class EmailService {
  constructor(@Inject(FactoryName.RedisFactory) private redis: Redis, @Inject(FactoryName.TransportFactory) private transporter: Transporter) {
  }

  async sendEmail(info: Mail.Options) {
    const [sendInfo, code] = combineEmailOptions(info)
    await this.redis.set(`${MicroServiceNameEnum.EMAIL_SERVICE}:${info.to}`, code, 'PX', EMAIL_CODE_EXPIRE_TIME)
    return this.transporter.sendMail(sendInfo)
  }
}
