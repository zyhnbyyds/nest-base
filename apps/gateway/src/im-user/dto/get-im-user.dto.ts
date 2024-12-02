import { PageDto } from '@libs/common/dtos/page.dto'
import { IsString, Length } from 'class-validator'

export class GetImUserListDto extends PageDto {
  @IsString()
  @Length(20)
  userName?: string
}
