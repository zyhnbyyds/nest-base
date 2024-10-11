import { Provider } from '@nestjs/common'
import Redis from 'ioredis'
import { redisConfig } from '../config'
import { RedisConfig } from '../config/interface'
import { FactoryName } from '../enums/factory'

const RedisFactory: Provider = {
  provide: FactoryName.RedisFactory,
  useFactory: () => {
    const { port, host } = redisConfig() as RedisConfig
    return new Redis({
      port,
      host,
      // TODO: 配置权限
    })
  },
}

export default RedisFactory
