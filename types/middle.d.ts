declare namespace Middle {
  interface ProcessEnvMid {
    NODE_ENV?: 'dev' | 'prod' | 'local'

    // Redis
    REDIS_HOST: string
    REDIS_PORT: number
    REDIS_PASSWORD: string
    REDIS_DB: number

    // Jwt auth
    JWT_SECRET: string
    JWT_EXPIRES_IN: string
    JWT_REFRESH_SECRET: string

    // Database
    DB_PORT: number
    DB_HOST: string
    DB_USERNAME: string
    DB_PASSWORD: string
    DB_DATABASE: string

    // Email
    EMAIL_HOST: string
    EMAIL_PORT: number
    EMAIL_USER: string
    EMAIL_PASSWORD: string
    EMAIL_FROM: string

    // NATS
    NATS_SERVER_URL: string
    NATS_AUTH_USER: string
    NATS_AUTH_PASSWORD: string

    // Ali deepseek Ai
    ALI_DEEPDEEK_APP_KEY: string
    ALI_DEEPSEEK_APP_BASE_URL: string

    // DeepSeek ai
    DEEP_SEEK_APP_KEY: string
    DEEP_SEEK_APP_BASE_URL: string

    // Weixin
    WX_APPID_GZ: string
    WX_SECRET_GZ: string
    WX_TOKEN: string
    WX_TEST_TEMPLATE_ID: string
  }
}
