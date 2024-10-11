import { registerAs } from '@nestjs/config'
import { getEnv } from '../utils/env'
import { DatabaseConfig } from './interface'

export default registerAs<DatabaseConfig>('database', () => ({
  host: getEnv('DB_HOST'),
  port: getEnv('DB_PORT'),
  username: getEnv('DB_USERNAME'),
  password: getEnv('DB_PASSWORD'),
  database: getEnv('DB_DATABASE'),
}))
