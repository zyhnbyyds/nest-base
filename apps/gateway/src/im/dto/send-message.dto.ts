import { ImSendMessageTypeEnum } from '@libs/common/enums/im'
import { IsEnum, IsNotEmpty, IsString, Length } from 'class-validator'

/**
 * 发送消息/私聊
 */
export class SendMessageDto {
  @IsString()
  @IsNotEmpty()
  @Length(17)
  toUser: string

  @IsString()
  content: string

  @IsEnum(ImSendMessageTypeEnum)
  messageType?: ImSendMessageTypeEnum = ImSendMessageTypeEnum.TEXT
}
