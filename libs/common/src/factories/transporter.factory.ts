import { Provider } from '@nestjs/common'
import { createTransport } from 'nodemailer'
import { emailConfig } from '../config'
import { EmailConfig } from '../config/interface'
import { FactoryName } from '../enums/factory'

export const TransportFactory: Provider = {
  provide: FactoryName.TransportFactory,
  useFactory: () => {
    const { host, port, user, password } = emailConfig() as EmailConfig
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
