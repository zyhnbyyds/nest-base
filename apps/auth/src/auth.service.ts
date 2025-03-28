import type { StringValue } from 'ms'
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
import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { ClientProxy } from '@nestjs/microservices'
import Redis from 'ioredis'
import ms from 'ms'
import SMTPTransport from 'nodemailer/lib/smtp-transport'
import { lastValueFrom } from 'rxjs'
import { EmailRegisterDto, EmailVerifyDto } from './dto/register.dto'

@Injectable()
export class AuthService {
  constructor(
    private db: PrismaService,

    @Inject(MicroServiceNameEnum.EMAIL_SERVICE)
    private emailApp: ClientProxy,

    @Inject(FactoryName.RedisFactory)
    private redisApp: Redis,

    private jwtService: JwtService,

    private configService: ConfigService,
  ) {}

  async sendEmailCode(body: EmailRegisterDto) {
    await this.emailApp.connect()
    try {
      await lastValueFrom(this.emailApp.send<SMTPTransport.SentMessageInfo>({ cmd: MicroServiceMessageEnum.SEND_EMAIL }, { to: body.email }))
    }
    catch (err) {
      return Result.fail(err)
    }
    return Result.ok(SuccessMsg.EmailVerifyCodeSendSuccess)
  }

  async loginUseEmail(body: EmailVerifyDto) {
    try {
      const cacheVerifyCode = await this.redisApp.get(`${MicroServiceNameEnum.EMAIL_SERVICE}:${body.email}`)
      if (!cacheVerifyCode || cacheVerifyCode !== body.code) {
        return Result.fail(EmailErrorMsg.EmailVerifyCodeError)
      }

      // if has registered return register info
      let registeredUser = await this.db.registerUser.findUnique({ where: { email: body.email }, select: { userId: true, status: true, email: true } })

      if (!registeredUser) {
        registeredUser = await this.db.registerUser.create({ data: { email: body.email, userId: new Snowflake(1, 1).generateId(), status: RegisterUserStatus.NotAddUserInfo }, select: { userId: true, status: true, email: true } })
      }

      this.delEmailCode(body.email)
      const token = await this.generateToken(body.email, registeredUser.userId)

      if (registeredUser.status === RegisterUserStatus.NotAddUserInfo) {
        await this.setToken(token, registeredUser.userId)
        return Result.success({ verify: registeredUser, token })
      }

      else if (registeredUser.status === RegisterUserStatus.Success) {
        const user = await this.db.user.findUnique({ where: { userId: registeredUser.userId }, select: { userId: true, email: true } })
        await this.setToken(token, registeredUser.userId)
        return Result.success({ verify: { ...user, status: 0 }, token })
      }
      else {
        return Result.fail()
      }
    }

    catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  delEmailCode(email: string) {
    this.redisApp.del(`${MicroServiceNameEnum.EMAIL_SERVICE}:${email}`)
  }

  setToken(token: string, userId: string) {
    const { expiresIn } = this.configService.get<AuthConfig>('jwt')
    return this.redisApp.set(`${RedisCacheKey.AuthToken}${userId}`, token, 'PX', ms(expiresIn as StringValue))
  }

  generateToken(email: string, userId: string) {
    return this.jwtService.signAsync({ email, userId })
  }
}
