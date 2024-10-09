import { Inject, Injectable } from '@nestjs/common'
import { EMAIL_CODE_EXPIRE_TIME } from 'common/common/config/constant'
import { FactoryName } from 'common/common/enums/factory'
import { MicroServiceNameEnum } from 'common/common/enums/subapps'
import { combineEmailOptions } from 'common/common/utils/email'
import Redis from 'ioredis'
import { createTransport, Transporter } from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'

@Injectable()
export class EmailService {
  private transporter: Transporter<SMTPTransport.SentMessageInfo, SMTPTransport.Options>
  constructor(@Inject(FactoryName.RedisFactory) private redis: Redis) {
    this.transporter = createTransport({
      host: 'smtp.163.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    })
  }

  async sendEmail(info: Mail.Options) {
    const [sendInfo, code] = combineEmailOptions(info)
    await this.redis.set(`${MicroServiceNameEnum.EMAIL_SERVICE}:${info.to}`, code, 'PX', EMAIL_CODE_EXPIRE_TIME)
    return this.transporter.sendMail(sendInfo)
  }
}
