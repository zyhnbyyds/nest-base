import { IsString, Length } from 'class-validator'

export class AddFriendDto {
  @IsString()
  friendId: string

  @Length(1, 100)
  remark: string
}
