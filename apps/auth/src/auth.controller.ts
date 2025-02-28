import { Body, Controller, Get, HttpCode, Post, Query, Req, Res, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { SkipThrottle } from '@nestjs/throttler'
import { FastifyReply } from 'fastify'
import { AuthService } from './auth.service'
import { EmailRegisterDto, EmailVerifyDto } from './dto/register.dto'

@Controller('/auth')
export class AuthController {
  private readonly clients = [
    {
      clientId: 'my-client',
      clientSecret: 'my-secret',
      redirectUris: ['http://localhost:3000/callback'],
    },
  ]

  constructor(private readonly authService: AuthService) {}
  @SkipThrottle()
  @HttpCode(200)
  @Post('/sendEmailCode')
  sendEmailCode(@Body() body: EmailRegisterDto) {
    return this.authService.sendEmailCode(body)
  }

  @HttpCode(200)
  @Post('/loginUseEmail')
  loginUseEmail(@Body() body: EmailVerifyDto) {
    return this.authService.loginUseEmail(body)
  }

  // 授权端点
  @Get('/oauth2/authorize')
  authorize(
    @Query('client_id') clientId: string,
    @Query('redirect_uri') redirectUri: string,
    @Query('state') state: string,
    @Res() res: FastifyReply,
  ) {
    // 模拟用户已登录，直接生成授权码并重定向
    const authCode = 'fake-auth-code-123'
    const redirectUrl = `${redirectUri}?code=${authCode}&state=${state}`
    return res.redirect(redirectUrl, 302)
  }

  // 令牌端点
  @Get('/oauth2/token')
  getToken(
    @Query('code') code: string,
    @Query('client_id') clientId: string,
    @Query('client_secret') clientSecret: string,
  ) {
    // 校验客户端和授权码
    const client = this.clients.find(c => c.clientId === clientId && c.clientSecret === clientSecret)
    if (!client || code !== 'fake-auth-code-123') {
      return { error: 'invalid_request' }
    }

    // 返回模拟的访问令牌
    return {
      access_token: 'fake-access-token-456',
      token_type: 'Bearer',
      expires_in: 3600,
    }
  }
}
