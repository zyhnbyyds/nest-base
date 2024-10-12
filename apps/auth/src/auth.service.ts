import { AuthConfig } from '@libs/common/config/interface'
import { EmailErrorMsg } from '@libs/common/enums/error'
import { FactoryName } from '@libs/common/enums/factory'
import { RedisCacheKey } from '@libs/common/enums/redis'
import { MicroServiceMessageEnum, MicroServiceNameEnum } from '@libs/common/enums/subapps'
import { SuccessMsg } from '@libs/common/enums/success'
import { RegisterUserStatus } from '@libs/common/enums/user/status'
import { PrismaService } from '@libs/common/services/prisma.service'
import { Result } from '@libs/common/utils/result'
import { Snowflake } from '@libs/common/utils/snow-flake'
import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { ClientProxy } from '@nestjs/microservices'
import Redis from 'ioredis'
import { omit } from 'lodash'
import SMTPTransport from 'nodemailer/lib/smtp-transport'
import { lastValueFrom } from 'rxjs'
import { EmailRegisterDto, EmailVerifyDto } from './dto/register.dto'

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,

    @Inject(MicroServiceNameEnum.EMAIL_SERVICE)
    private emailApp: ClientProxy,

    @Inject(FactoryName.RedisFactory)
    private redisApp: Redis,

    private jwtService: JwtService,

    private configService: ConfigService,
  ) {}

  async sendEmailCode(body: EmailRegisterDto) {
    await this.emailApp.connect()
    await lastValueFrom(this.emailApp.send<SMTPTransport.SentMessageInfo>({ cmd: MicroServiceMessageEnum.SEND_EMAIL }, { to: body.email }))
    return Result.ok(SuccessMsg.EmailVerifyCodeSendSuccess)
  }

  async loginUseEmail(body: EmailVerifyDto) {
    const cacheVerifyCode = await this.redisApp.get(`${MicroServiceNameEnum.EMAIL_SERVICE}:${body.email}`)
    if (!cacheVerifyCode || cacheVerifyCode !== body.code) {
      return Result.fail(EmailErrorMsg.EmailVerifyCodeError)
    }

    this.delEmailCode(body.email)
    // if has registered return register info
    const registeredUser = await this.prismaService.registerUser.findUnique({ where: { email: body.email }, select: { userId: true, status: true, email: true } })
    if (registeredUser) {
      this.delEmailCode(body.email)
      const token = await this.jwtService.signAsync({ email: body.email, userId: registeredUser.userId })

      if (registeredUser.status === RegisterUserStatus.NotAddUserInfo) {
        await this.setToken(token, registeredUser.userId)
        return Result.success({ verify: omit(registeredUser, ['status']), token })
      }

      else if (registeredUser.status === RegisterUserStatus.Success) {
        const user = await this.prismaService.user.findUnique({ where: { userId: registeredUser.userId }, select: { userId: true, email: true } })
        await this.setToken(token, registeredUser.userId)
        return Result.success({ verify: user, token })
      }
      else {
        return Result.fail()
      }
    }

    await this.prismaService.registerUser.create({ data: { email: body.email, userId: new Snowflake(1, 1).generateId(), status: RegisterUserStatus.NotAddUserInfo } })

    return Result.ok(SuccessMsg.EmailVerifySuccess)
  }

  delEmailCode(email: string) {
    this.redisApp.del(`${MicroServiceNameEnum.EMAIL_SERVICE}:${email}`)
  }

  setToken(token: string, userId: string) {
    const { expireTime } = this.configService.get<AuthConfig>('jwt')
    return this.redisApp.set(`${RedisCacheKey.AuthToken}${userId}`, token, 'PX', expireTime)
  }
}
