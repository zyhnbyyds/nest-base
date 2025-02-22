import { PageDto } from '@libs/common/dtos/page.dto'
import { IsOptional, IsString, Length } from 'class-validator'

/**
 * get user list dto
 */
export class GetUserListDto extends PageDto {
  @IsString()
  @Length(20)
  @IsOptional()
  userId?: string

  @IsString()
  @IsOptional()
  gender?: string

  @IsString()
  @IsOptional()
  country?: string

  @IsString()
  @IsOptional()
  province?: string

  @IsString()
  @IsOptional()
  userName?: string

  @IsString()
  @IsOptional()
  nickName?: string

  @IsString()
  @IsOptional()
  phone?: string

  @IsString()
  @IsOptional()
  email?: string
}
