import { MicroServiceNameEnum, MicroServicesEventEnum } from '@libs/common/enums/subapps'
import { FastifyRequestWithAuth } from '@libs/common/types/interface'
import { transReqToLogRecord } from '@libs/common/utils/logger'
import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Req } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { seconds, Throttle } from '@nestjs/throttler'
import { User } from '@prisma/client'
import { FastifyRequest } from 'fastify'
import { CreateUserDto } from './dto/createUser.dto'
import { UserService } from './user.service'

@Controller('user')
export class UserController {
  @Inject(MicroServiceNameEnum.LOGGER_SERVICE)
  private client: ClientProxy

  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Req() req: FastifyRequest) {
    await this.client.connect()
    this.client.emit(MicroServicesEventEnum.WRITE_LOG, transReqToLogRecord(req))

    return await this.userService.create(createUserDto)
  }

  @Throttle({ default: { ttl: seconds(30), limit: 1 } })
  @Get()
  findAll() {
    return this.userService.findAll()
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
  createUserFromRegisterUser(@Body() user: CreateUserDto) {
    return this.userService.create(user, false)
  }
}
