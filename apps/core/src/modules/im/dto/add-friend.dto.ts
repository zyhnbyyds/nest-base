import { IsEmpty, IsEnum, IsString, Length } from 'class-validator'

export class AddFriendDto {
  @IsString()
  friendId: string

  @Length(1, 500)
  remark: string
}

export class AdmitAddFriendDto {
  @IsString()
  id: string

  @IsString()
  remark?: string

  @IsEnum([0, 1])
  @IsEmpty()
  status: number
}
