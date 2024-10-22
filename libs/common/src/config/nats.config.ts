import { registerAs } from '@nestjs/config'
import { getEnv } from '../utils/env'

export default registerAs('nats', () => ({
  server: getEnv('NATS_SERVER_URL'),
  user: getEnv('NATS_AUTH_USER'),
  pass: getEnv('NATS_AUTH_PASSWORD'),
}))
