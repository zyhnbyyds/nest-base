import { IsEmpty, IsEnum, IsOptional, IsString, Length } from 'class-validator'

export class AdmitAddFriendDto {
  @IsString()
  id: string

  @IsString()
  remark?: string

  @IsEnum([0, 1])
  @IsEmpty()
  status: number
}

export class AddFriendDto {
  @IsString()
  friendId: string

  @Length(1, 500)
  @IsOptional()
  remark: string
}
