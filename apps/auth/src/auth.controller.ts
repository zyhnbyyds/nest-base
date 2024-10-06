import { ZodValidationPipe } from '@anatine/zod-nestjs'
import { Body, Controller, Post, UsePipes } from '@nestjs/common'
import { AuthService } from './auth.service'
import { EmailRegisterDto } from './dto/register.dto'

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/registerUseEmail')
  @UsePipes(ZodValidationPipe)
  registerUseEmail(@Body() body: EmailRegisterDto) {
    return this.authService.registerUseEmail(body)
  }
}
