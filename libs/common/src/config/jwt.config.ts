import { registerAs } from '@nestjs/config'
import ms from 'ms'
import { getEnv } from '../utils/env'

export default registerAs('jwt', () => ({
  secret: getEnv('JWT_SECRET'),
  expiresIn: getEnv('JWT_EXPIRES_IN'),
  expireTime: ms(getEnv('JWT_EXPIRES_IN')),
}))
