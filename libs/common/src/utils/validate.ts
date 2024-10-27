import { Logger } from '@nestjs/common'
import { ClassConstructor } from 'class-transformer'
import { validate, ValidationError } from 'class-validator'
import { assign } from 'lodash'

export interface NestedValidationErrors {
  constraints?: Record<string, string>
  children?: Record<string, NestedValidationErrors>
}

export function formatValidationErrors(errors: ValidationError[]): Record<string, NestedValidationErrors> {
  const result: Record<string, NestedValidationErrors> = {}

  errors.forEach((error) => {
    const nestedError: NestedValidationErrors = {}

    if (error.constraints) {
      nestedError.constraints = error.constraints
    }

    if (error.children && error.children.length > 0) {
      nestedError.children = formatValidationErrors(error.children)
    }

    result[error.property] = nestedError
  })

  return result
}

export async function validateWsBody<T extends object>(Cls: ClassConstructor<T>, body: T) {
  const errors = await validate(assign(new Cls(), body))

  const result = formatValidationErrors(errors)
  if (errors.length > 0) {
    Logger.error(JSON.stringify(errors))
  }

  return [result, errors.length > 0 ? result : null]
}
