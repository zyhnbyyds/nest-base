import { IsString, Length } from 'class-validator'

export class AddFriendDto {
  @IsString()
  friendId: string

  @IsString()
  userId: string
}
