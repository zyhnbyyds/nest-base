import { registerAs } from '@nestjs/config'

export default registerAs('es', () => ({
  url: process.env.ES_URL,
  username: process.env.ES_USER,
  password: process.env.ES_PASSWORD,
}))
