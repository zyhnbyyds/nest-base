import { SubAppEnum, SubAppPortEnum, SubAppRoutePrefixEnum } from '@libs/common/enums/subapps'
import { bootstrap } from '@libs/common/utils/bootstrap'
import { GatewayModule } from './gateway.module'

bootstrap({
  module: GatewayModule,
  port: SubAppPortEnum.Gateway,
  name: SubAppEnum.Gateway,
  fastifyCsrf: true,
  prefix: SubAppRoutePrefixEnum.Gateway,
  allExceptionsFilter: true,
  logger: true,
})
