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
  jwtSecret: string
  jwtExpire: string
}

export interface DatabaseConfig {
  host: string
  port: number
  username: string
  password: string
  database: string
}
