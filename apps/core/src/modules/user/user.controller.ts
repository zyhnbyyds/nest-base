import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Req } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { User } from '@prisma/client'
import { transReqToLogRecord } from 'common/common/utils/logger'
import { Snowflake } from 'common/common/utils/snow-flake'
import { FastifyRequest } from 'fastify'
import { timeout } from 'rxjs'
import { UserService } from './user.service'

@Controller('user')
export class UserController {
  @Inject('LOGGER_SERVICE')
  private client: ClientProxy

  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: User, @Req() req: FastifyRequest) {
    this.client.connect().then(() => {
      this.client.emit('record_log', transReqToLogRecord(req))
    })

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