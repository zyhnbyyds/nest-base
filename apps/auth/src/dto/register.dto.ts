import { createZodDto } from '@anatine/zod-nestjs'
import { z } from 'zod'

export const EmailRegisterSchema = z.object({
  email: z.string().email(),
}).required()

export const PasswordLoginSchema = z.object({
  password: z.string().min(6).max(20),
}).required()

export class EmailRegisterDto extends createZodDto(EmailRegisterSchema) {}
export class PasswordLoginDto extends createZodDto(PasswordLoginSchema) {}
