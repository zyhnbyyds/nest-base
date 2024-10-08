import { Inject, Injectable } from '@nestjs/common'
import { ClientRedis } from '@nestjs/microservices'
import { MicroServiceNameEnum } from 'common/common/enums/subapps'
import { combineEmailOptions } from 'common/common/utils/email'
import { createTransport, Transporter } from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'

@Injectable()
export class EmailService {
  private transporter: Transporter<SMTPTransport.SentMessageInfo, SMTPTransport.Options>
  constructor(@Inject(MicroServiceNameEnum.REDIS_SERVICE) private client: ClientRedis) {
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
    await this.client.connect()
    const [sendInfo, _code] = combineEmailOptions(info)
    return this.transporter.sendMail(sendInfo)
  }
}
