import Redis from 'ioredis'
import { FactoryName } from '../enums/factory'
import { customValidateEnv } from '../utils/env'

const RedisFactory = {
  provide: FactoryName.RedisFactory,
  useFactory: () => {
    const { REDIS_PORT, REDIS_HOST } = customValidateEnv(process.env)
    return new Redis({
      port: REDIS_PORT,
      host: REDIS_HOST,
      // TODO: 配置权限
    })
  },
}

export default RedisFactory
