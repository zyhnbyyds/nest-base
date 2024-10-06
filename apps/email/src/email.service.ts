import { Injectable } from '@nestjs/common'
import { combineEmailOptions } from 'common/common/utils/email'
import { createTransport, Transporter } from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'

@Injectable()
export class EmailService {
  private transporter: Transporter<SMTPTransport.SentMessageInfo, SMTPTransport.Options>
  constructor() {
    this.transporter = createTransport({
      host: 'smtp.163.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })
  }

  sendEmail(info: Mail.Options) {
    return this.transporter.sendMail(combineEmailOptions(info))
  }
}
