import Redis from 'ioredis'
import { FactoryName } from '../enums/factory'

const RedisFactory = {
  provide: FactoryName.RedisFactory,
  useFactory: () => {
    return new Redis({
      port: Number.parseInt(process.env.REDIS_PORT),
      host: process.env.REDIS_HOST,
    })
  },
}

export default RedisFactory
