import { PageDto } from '@libs/common/dtos/page.dto'
import { IsString, Length } from 'class-validator'

export class ReadMessageDto {
  @Length(17)
  @IsString()
  fromUserId: string

  @Length(17)
  @IsString()
  toUserId: string
}

export class SendMessageDto extends ReadMessageDto {
  @IsString()
  content: string

  @IsString()
  messageType: string
}

export class GetImMessageListDto extends PageDto {
  @IsString()
  @Length(17)
  friendId: string
}
