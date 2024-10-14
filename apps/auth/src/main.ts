import { SubAppPortEnum } from '@libs/common/enums/subapps'
import { bootstrap } from '@libs/common/utils/bootstrap'
import { AuthModule } from './auth.module'

bootstrap({
  name: 'Auth',
  port: SubAppPortEnum.Auth,
  module: AuthModule,
  allExceptionsFilter: true,
  logger: true,
  fastifyCsrf: true,
})
