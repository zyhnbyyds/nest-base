import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query } from '@nestjs/common'
import { CreateImUserDto } from './dto/create-im-user.dto'
import { GetImMessageListDto, ReadMessageDto } from './dto/im-message'
import { ImMessageService } from './im-message.service'

@Controller('/im/message')
export class ImMessageController {
  constructor(private readonly imMessageService: ImMessageService) {}

  @HttpCode(HttpStatus.OK)
  @Post()
  create(@Body() createImUserDto: CreateImUserDto) {
    return this.imMessageService.create(createImUserDto)
  }

  @Get('/list')
  findMessageList(@Query() query: GetImMessageListDto) {
    return this.imMessageService.findMessageList(query)
  }

  @Get(':id')
  findOne(@Param('id') userId: string) {
    return this.imMessageService.findOne(userId)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.imMessageService.remove(+id)
  }

  @Post('/readMessage')
  readMessage(@Body() body: ReadMessageDto) {
    return this.imMessageService.readMessage(body)
  }
}
