import { Body, Controller, HttpCode, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { EmailRegisterDto, EmailVerifyDto } from './dto/register.dto'

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
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
}
