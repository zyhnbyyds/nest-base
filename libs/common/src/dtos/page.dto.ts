import { Transform } from 'class-transformer'
import { IsNumber, IsOptional, Min } from 'class-validator'

export class PageDto {
  @IsNumber()
  @Min(1)
  @IsOptional()
  @Transform(({ value }) => {
    if (value)
      return Number(value)
    return 1
  })
  current: number

  @Min(10)
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => {
    if (value)
      return Number(value)
    return 12
  })
  size: number
}
