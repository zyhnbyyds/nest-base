import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common'
import { CreateImUserDto, LoginImDto } from './dto/create-im-user.dto'
import { ImUserService } from './im-user.service'

@Controller('im-user')
export class ImUserController {
  constructor(private readonly imUserService: ImUserService) {}

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  login(@Body() body: LoginImDto) {
    return this.imUserService.login(body.userId)
  }

  @Post('/logout')
  logout(@Body() body: LoginImDto) {
    return this.imUserService.logout(body.userId)
  }

  @HttpCode(HttpStatus.OK)
  @Post()
  create(@Body() createImUserDto: CreateImUserDto) {
    return this.imUserService.create(createImUserDto)
  }

  @Get()
  findAll() {
    return this.imUserService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') userId: string) {
    return this.imUserService.findOne(userId)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.imUserService.remove(+id)
  }
}
