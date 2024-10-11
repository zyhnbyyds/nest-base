import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { EmailRegisterDto } from './dto/register.dto'

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/registerUseEmail')
  registerUseEmail(@Body() body: EmailRegisterDto) {
    return this.authService.registerUseEmail(body)
  }
}
