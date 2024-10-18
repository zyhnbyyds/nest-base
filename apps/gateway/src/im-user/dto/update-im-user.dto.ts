import { PartialType } from '@nestjs/swagger'
import { CreateImUserDto } from './create-im-user.dto'

export class UpdateImUserDto extends PartialType(CreateImUserDto) {}
