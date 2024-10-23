import { registerAs } from '@nestjs/config'

export default registerAs('nats', () => ({
  server: process.env.NATS_SERVER_URL,
  user: process.env.NATS_AUTH_USER,
  pass: process.env.NATS_AUTH_PASSWORD,
}))
