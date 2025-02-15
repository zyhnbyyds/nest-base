import { CommonModule } from '@libs/common'
import { JwtModuleImport } from '@libs/common/config/module-register'
import { TimeZoneMiddleware } from '@libs/common/middlewares/timezone.middleware'
import { TasksService } from '@libs/common/services/task.service'
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { ImModule } from './modules/im/im.module'
import { NotificationModule } from './modules/notification/notification.module'
import { UserModule } from './modules/user/user.module'

@Module({
  imports: [
    UserModule,
    ImModule,
    CommonModule,
    JwtModuleImport,
    ScheduleModule.forRoot(),
    NotificationModule,
  ],
  providers: [TasksService],
})
export class CoreModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TimeZoneMiddleware).forRoutes('*')
  }
}
