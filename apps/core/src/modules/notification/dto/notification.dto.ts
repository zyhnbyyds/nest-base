import { PageDto } from '@libs/common/dtos/page.dto'
import { IsOptional, IsString } from 'class-validator'

export class GetNotificationListDto extends PageDto {
  @IsString()
  @IsOptional()
  title?: string
}
