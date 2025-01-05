import { SubAppEnum } from '@libs/common/enums/subapps'
import { microBootstrap } from '@libs/common/utils/bootstrap'
import { EmailModule } from './email.module'

microBootstrap({
  module: EmailModule,
  name: SubAppEnum.Email,
})
