import { IsEmpty, IsString } from 'class-validator'

export class CreateImUserDto {
  @IsString()
  userId: string
}

export class LoginImDto extends CreateImUserDto {}
