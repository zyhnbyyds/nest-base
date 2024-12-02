import { PageDto } from '@libs/common/dtos/page.dto'
import { IsString, Length } from 'class-validator'
import { User } from 'packages/mysql'

/**
 * get user list dto
 */
export class GetUserListDto extends PageDto implements Partial<User> {
  @IsString()
  @Length(20)
  userId?: string

  @IsString()
  gender?: string

  @IsString()
  country?: string
}
