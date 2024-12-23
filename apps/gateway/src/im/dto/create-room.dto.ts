import { IsArray, IsString, Length } from 'class-validator'

export class CreateRoomDto {
  @IsString()
  @Length(1, 20)
  groupName: string

  @IsString()
  @Length(1, 200)
  description?: string

  @IsArray()
  slaveIds?: string[]
}
