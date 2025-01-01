const dotenv = require('dotenv')
const { Redis } = require('ioredis')

dotenv.config({ path: ['.env', '.env.dev'] })

process.env.NODE_ENV = 'dev'

const redis = new Redis()

redis.set('email_service:test-register@qq.com', '222222')
redis.set('email_service:test@test.com', '111111')

redis.quit()
