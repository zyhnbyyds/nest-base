import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { MicroServiceMessageEnum, MicroServiceNameEnum } from 'common/common/enums/subapps'
import { PrismaService } from 'common/common/services/prisma.service'
import SMTPTransport from 'nodemailer/lib/smtp-transport'
import { EmailRegisterDto } from './dto/register.dto'

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService, @Inject(MicroServiceNameEnum.EMAIL_SERVICE) private emailApp: ClientProxy) {}

  async registerUseEmail(body: EmailRegisterDto) {
    await this.emailApp.connect()
    const res = await this.prismaService.user.findUnique({ where: { email: body.email } })
    // const snowflake = new Snowflake(1, 1)
    if (!res) {
      return this.emailApp.send<SMTPTransport.SentMessageInfo>({ cmd: MicroServiceMessageEnum.SEND_EMAIL }, { to: body.email })
      // await this.prismaService.user.create({ data: { email: body.email!, userId: snowflake.generateId(), openId: snowflake.generateId() } })
    }
    return res
  }
}
