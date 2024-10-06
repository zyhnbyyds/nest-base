import { Controller } from '@nestjs/common'
import { MessagePattern } from '@nestjs/microservices'
import { MicroServiceMessageEnum } from 'common/common/enums/subapps'
import { Options } from 'nodemailer/lib/mailer'
import { EmailService } from './email.service'

@Controller()
export class EmailController {
  constructor(private emailService: EmailService) {}
  @MessagePattern({ cmd: MicroServiceMessageEnum.SEND_EMAIL })
  accumulate(options: Options) {
    return this.emailService.sendEmail(options)
  }
}
