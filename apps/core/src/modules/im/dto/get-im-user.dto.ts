import { PageDto } from '@libs/common/dtos/page.dto'
import { IsOptional, IsString, Length } from 'class-validator'

export class GetImUserListDto extends PageDto {
  @IsString()
  @IsOptional()
  @Length(20)
  userName?: string
}
