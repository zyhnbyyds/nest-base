import { ErrorMsg } from '@libs/common/enums/error'
import { MicroServiceMessageEnum, MicroServiceNameEnum } from '@libs/common/enums/subapps'
import { SuccessMsg } from '@libs/common/enums/success'
import { PrismaService } from '@libs/common/services/prisma.service'
import { Result } from '@libs/common/utils/result'
import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import SMTPTransport from 'nodemailer/lib/smtp-transport'
import { lastValueFrom } from 'rxjs'
import { EmailRegisterDto } from './dto/register.dto'

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService, @Inject(MicroServiceNameEnum.EMAIL_SERVICE) private emailApp: ClientProxy) {}

  async registerUseEmail(body: EmailRegisterDto) {
    await this.emailApp.connect()
    const res = await this.prismaService.user.findUnique({ where: { email: body.email } })
    if (!res) {
      await lastValueFrom(this.emailApp.send<SMTPTransport.SentMessageInfo>({ cmd: MicroServiceMessageEnum.SEND_EMAIL }, { to: body.email }))
      return Result.ok(SuccessMsg.EmailVerifyCodeSendSuccess)
    }

    return Result.fail(ErrorMsg.EmailRegistered)
  }
}
