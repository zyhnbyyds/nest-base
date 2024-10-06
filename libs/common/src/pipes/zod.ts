import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common'
import { ZodSchema } from 'zod'

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown, _metadata: ArgumentMetadata) {
    try {
      const parsedValue = this.schema.safeParse(value)
      if (parsedValue.success) {
        return parsedValue.data
      }
      else {
        throw new BadRequestException(parsedValue.error)
      }
    }
    catch (error) {
      throw new BadRequestException(error)
    }
  }
}
