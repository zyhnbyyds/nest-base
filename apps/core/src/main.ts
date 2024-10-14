import { randomBytes } from 'node:crypto'
import { SubAppPortEnum, SubAppRoutePrefixEnum } from '@libs/common/enums/subapps'
import { bootstrap } from '@libs/common/utils/bootstrap'
import { CoreModule } from './core.module'

bootstrap({
  module: CoreModule,
  name: 'Core',
  port: SubAppPortEnum.Core,
  allExceptionsFilter: true,
  logger: true,
  prefix: SubAppRoutePrefixEnum.Core,
  fastifyCsrf: true,
  secureSession: {
    cookie: {
      path: '/',
    },
    cookieName: 'core-cookie',
    sessionName: 'core-session',
    key: randomBytes(32),
  },
})
