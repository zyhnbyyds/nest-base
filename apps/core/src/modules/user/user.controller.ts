import { MicroServiceNameEnum, MicroServicesEventEnum } from '@libs/common/enums/subapps'
import { transReqToLogRecord } from '@libs/common/utils/logger'
import { Snowflake } from '@libs/common/utils/snow-flake'
import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Req, UsePipes } from '@nestjs/common'
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

    const snowflake = new Snowflake(1, 1)
    return await this.userService.create({ ...(createUserDto as unknown as User), openId: snowflake.generateId(), userId: snowflake.generateId() })
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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: User) {
    return this.userService.update(id, updateUserDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id)
  }
}
