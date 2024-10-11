import { IsEmail, Length } from 'class-validator'

export class EmailRegisterDto {
  @IsEmail()
  email: string
}

export class EmailVerifyDto {
  @IsEmail()
  email: string

  @Length(6)
  code: string
}
