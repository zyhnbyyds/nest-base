import { microBootstrap } from '@libs/common/utils/bootstrap'
import { LoggerModule } from './logger.module'

microBootstrap({
  module: LoggerModule,
  name: 'Logger',
})
