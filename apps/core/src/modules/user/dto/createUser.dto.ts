import { Transform } from 'class-transformer'
import { IsEmail, IsEnum, IsOptional, IsString, IsUrl, MaxLength, MinLength } from 'class-validator'

export class CreateUserDtoWithoutEmail {
  @IsString({ message: '密码长度在6-32位' })
  @MinLength(6)
  @MaxLength(32)
  password: string

  @IsString({ message: '昵称长度在1-32位' })
  @MinLength(1)
  @MaxLength(32)
  nickname: string

  @IsString()
  @MinLength(1)
  @MaxLength(32)
  userName: string

  @IsUrl()
  @Transform(({ value }) => value.trim())
  avatarUrl: string

  @IsEnum(['male', 'female'])
  gender: 'male' | 'female'

  @IsEnum(['zh-CN', 'en-US'])
  @Transform(({ value }) => value || 'zh-CN')
  language: 'zh-CN' | 'en-US'

  @IsString()
  @IsOptional()
  @MaxLength(10)
  province: string | null

  @IsString()
  @IsOptional()
  @MaxLength(10)
  country: string | null

  @IsString()
  @MaxLength(32)
  phone: string

  @IsOptional()
  @IsString()
  timeZone: string | null
}

export class CreateUserDto extends CreateUserDtoWithoutEmail {
  @IsEmail()
  email: string
}
