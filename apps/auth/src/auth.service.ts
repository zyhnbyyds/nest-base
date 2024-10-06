import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { MicroServiceMessageEnum, MicroServiceNameEnum, MicroServicesEventEnum } from 'common/common/enums/subapps'
import { PrismaService } from 'common/common/services/prisma.service'
import { Snowflake } from 'common/common/utils/snow-flake'
import SMTPTransport from 'nodemailer/lib/smtp-transport'
import { EmailRegisterDto } from './dto/register.dto'

@Injectable()
export class AuthService {
  @Inject(MicroServiceNameEnum.EMAIL_SERVICE)
  private emailApp: ClientProxy

  constructor(private prismaService: PrismaService) {}

  async registerUseEmail(body: EmailRegisterDto) {
    const res = await this.prismaService.user.findUnique({ where: { email: body.email } })
    const snowflake = new Snowflake(1, 1)
    // TODO: redis add
    if (!res) {
      return this.emailApp.send<SMTPTransport.SentMessageInfo>({ cwd: MicroServiceMessageEnum.SEND_EMAIL }, body)
      // await this.prismaService.user.create({ data: { email: body.email!, userId: snowflake.generateId(), openId: snowflake.generateId() } })
    }
    return res
  }
}
