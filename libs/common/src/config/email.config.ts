import { registerAs } from '@nestjs/config'
import { getEnv } from '../utils/env'
import { EmailConfig } from './interface'

export default registerAs<EmailConfig>('email', () => ({
  host: getEnv('EMAIL_HOST'),
  port: getEnv('EMAIL_PORT'),
  user: getEnv('EMAIL_USER'),
  password: getEnv('EMAIL_PASSWORD'),
  from: getEnv('EMAIL_FROM'),
}))
