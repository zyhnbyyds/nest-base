import { Public } from '@libs/common/guards/public.guard'
import { FastifyRequestWithAuth } from '@libs/common/types/interface'
import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query, Req, Res, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { User } from '@prisma/client'
import { FastifyReply } from 'fastify'
import { CreateUserDto, CreateUserDtoWithoutEmail } from './dto/createUser.dto'
import { GetUserListDto } from './dto/get-user-list-dto'
import { UserService } from './user.service'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto)
  }

  @Get('/list')
  findAll(@Query() query: GetUserListDto) {
    return this.userService.findAll(query)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id)
  }

  @Get('/userInfo')
  userInfo(@Req() req: FastifyRequestWithAuth) {
    return this.userService.findOne(req.verify.userId)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: User) {
    return this.userService.update(id, updateUserDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id)
  }

  @Post('/createUserFromRegisterUser')
  @HttpCode(200)
  createUserFromRegisterUser(@Body() user: CreateUserDtoWithoutEmail, @Req() req: FastifyRequestWithAuth) {
    return this.userService.createUserFromRegisterUser(user, req.verify)
  }

  // auth.controller.ts
  @Get('login')
  @Public()
  @UseGuards(AuthGuard('oauth2'))
  login(@Res({ passthrough: true }) _res: FastifyReply) {
  // 自动重定向到认证服务器
  }

  @Get('callback')
  @Public()
  @UseGuards(AuthGuard('oauth2'))
  callback(@Res({ passthrough: true }) res: FastifyReply) {
    const token = '12121'
    // 重定向到前端页面并携带 Token
    res.redirect(`http://localhost:3000?token=${token}`)
  }
}
