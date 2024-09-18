import { Controller, Get, Post } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { User } from '@prisma/client'
import { AppService } from './app.service'

@Controller('/')
@ApiTags('user')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/createUser')
  async createUser() {
    await this.appService.createUser()
    return 'success'
  }

  @ApiResponse({
    status: 200,
    description: 'The found record',
  })
  @Get('/getUsers')
  async getUsers() {
    return await this.appService.getUsers()
  }
}
