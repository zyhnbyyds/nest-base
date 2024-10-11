import { registerAs } from '@nestjs/config'
import { getEnv } from '../utils/env'
import { RedisConfig } from './interface'

export default registerAs<RedisConfig>('redis', () => ({
  host: getEnv('REDIS_HOST'),
  port: getEnv('REDIS_PORT'),
  password: getEnv('REDIS_PASSWORD'),
  db: getEnv('REDIS_DB'),
  user: getEnv('REDIS_USER'),
}))
