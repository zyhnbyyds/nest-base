declare namespace global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production'

      // Redis
      REDIS_HOST: string
      REDIS_PORT: number
      REDIS_PASSWORD: string
      REDIS_DB: string

      // Jwt auth
      JWT_SECRET: string
      JWT_EXPIRES_IN: string
      JWT_REFRESH_SECRET: string

      // Database
      /** dd */
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
    }
  }
}
