import { MicroServiceMessageEnum } from '@libs/common/enums/subapps'
import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { Options } from 'nodemailer/lib/mailer'
import { EmailService } from './email.service'

@Controller()
export class EmailController {
  constructor(private emailService: EmailService) {}
  @MessagePattern({ cmd: MicroServiceMessageEnum.SEND_EMAIL })
  async sendEmail(@Payload() options: Options) {
    return await this.emailService.sendEmail(options)
  }
}
