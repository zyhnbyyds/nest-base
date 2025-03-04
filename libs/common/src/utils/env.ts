import { plainToInstance } from 'class-transformer'
import { IsEnum, IsNumber, IsString, Max, Min, validateSync } from 'class-validator'

export function isDevMode(): boolean {
  return process.env.NODE_ENV === 'dev'
}

enum Environment {
  Development = 'dev',
  Production = 'prod',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment = Environment.Development

  // Redis
  @IsString()
  REDIS_HOST: string = '127.0.0.1'

  @IsNumber()
  @Min(0)
  @Max(65535)
  REDIS_PORT: number = 6379

  @IsString()
  REDIS_PASSWORD: string = ''

  @IsNumber()
  @Min(0)
  REDIS_DB: number = 0

  // Jwt auth
  @IsString()
  JWT_SECRET: string

  @IsString()
  JWT_EXPIRES_IN: string = '1d'

  @IsString()
  JWT_REFRESH_SECRET: string

  // Database
  @IsNumber()
  @Min(0)
  @Max(65535)
  DB_PORT: number = 5432

  @IsString()
  DB_HOST: string = '127.0.0.1'

  @IsString()
  DB_USERNAME: string

  @IsString()
  DB_PASSWORD: string

  @IsString()
  DB_DATABASE: string

  // Email
  @IsString()
  EMAIL_HOST: string

  @IsNumber()
  @Min(0)
  @Max(65535)
  EMAIL_PORT: number = 587

  @IsString()
  EMAIL_USER: string

  @IsString()
  EMAIL_PASSWORD: string

  @IsString()
  EMAIL_FROM: string

  // NATS
  @IsString()
  NATS_SERVER_URL: string = 'nats://localhost:4222'

  @IsString()
  NATS_AUTH_USER: string

  @IsString()
  NATS_AUTH_PASSWORD: string

  // WX
  @IsString()
  WX_APPID_GZ: string

  @IsString()
  WX_SECRET_GZ: string
}

export function customValidateEnv(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(
    EnvironmentVariables,
    config,
    { enableImplicitConversion: true },
  )

  const errors = validateSync(validatedConfig, { skipMissingProperties: false })

  if (errors.length > 0) {
    throw new Error(errors.toString())
  }
  return validatedConfig
}
