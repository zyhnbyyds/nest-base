import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { User } from '@prisma/client'
import { Snowflake } from 'common/common/utils/snow-flake'
import { UserService } from './user.service'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: User) {
    const snowflake = new Snowflake(1, 1)
    return await this.userService.create({ ...createUserDto, openId: snowflake.generateId(), userId: snowflake.generateId() })
  }

  @Get()
  findAll() {
    return this.userService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: User) {
    return this.userService.update(id, updateUserDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id)
  }
}
