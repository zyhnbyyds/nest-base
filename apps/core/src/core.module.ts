import { CommonModule } from '@libs/common'
import { JwtModuleImport } from '@libs/common/config/module-register'
import { TasksService } from '@libs/common/services/task.service'
import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { ImModule } from './modules/im/im.module'
import { UserModule } from './modules/user/user.module'

@Module({
  imports: [
    UserModule,
    ImModule,
    CommonModule,
    JwtModuleImport,
    ScheduleModule.forRoot(),
  ],
  providers: [TasksService],
})
export class CoreModule {}
