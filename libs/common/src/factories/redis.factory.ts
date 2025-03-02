import { Provider } from '@nestjs/common'
import Redis from 'ioredis'
import { FactoryName } from '../enums/factory'
import { customValidateEnv } from '../utils/env'

const RedisFactory: Provider = {
  provide: FactoryName.RedisFactory,
  useFactory: () => {
    const { REDIS_PORT, REDIS_HOST } = customValidateEnv(process.env)

    return new Redis({
      port: REDIS_PORT,
      host: REDIS_HOST,
      // password: REDIS_PASSWORD,
    })
  },
}

export default RedisFactory
