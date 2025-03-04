export interface RedisConfig {
  host: string
  port: number
  password: string
  db: number
  user: string
}

export interface EmailConfig {
  host: string
  port: number
  user: string
  password: string
}

export interface AuthConfig {
  secret: string
  expiresIn: string
}

export interface DatabaseConfig {
  host: string
  port: number
  username: string
  password: string
  database: string
}

export interface NatsConfig {
  server: string
  user: string
  pass: string
}

export interface WxConfig {
  appid: string
  secret: string
  token: string
  templateId: string
}
