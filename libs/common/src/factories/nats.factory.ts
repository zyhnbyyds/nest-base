import { Provider } from '@nestjs/common'
import { connect } from 'nats'
import { FactoryName } from '../enums/factory'
import { customValidateEnv } from '../utils/env'

const NatsFactory: Provider = {
  provide: FactoryName.NatsFactory,
  useFactory: async () => {
    const { NATS_AUTH_PASSWORD, NATS_AUTH_USER, NATS_SERVER_URL } = customValidateEnv(process.env)

    const nats = await connect({ servers: NATS_SERVER_URL, user: NATS_AUTH_USER, pass: NATS_AUTH_PASSWORD })

    return nats
  },
}

export default NatsFactory
