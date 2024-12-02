import { Transform } from 'class-transformer'
import { IsInt, Min } from 'class-validator'

export class PageDto {
  @IsInt()
  @Min(1)
  @Transform(({ value }) => Number.parseInt(value, 10))
  current = 1

  @IsInt()
  @Min(1)
  @Transform(({ value }) => Number.parseInt(value, 10))
  size = 10
}
