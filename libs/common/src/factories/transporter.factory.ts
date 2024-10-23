import { Provider } from '@nestjs/common'
import { createTransport } from 'nodemailer'
import { FactoryName } from '../enums/factory'
import { customValidateEnv } from '../utils/env'

export const TransportFactory: Provider = {
  provide: FactoryName.TransportFactory,
  useFactory: () => {
    const { EMAIL_HOST: host, EMAIL_PORT: port, EMAIL_USER: user, EMAIL_PASSWORD: password } = customValidateEnv(process.env)
    return createTransport({
      host,
      port,
      secure: true,
      auth: {
        user,
        pass: password,
      },
    })
  },
}
