import { CommonModule } from '@libs/common'
import { JwtModuleImport } from '@libs/common/config/module-register'
import DeepSeekFactory from '@libs/common/factories/deepseek.factory'
import { TimeZoneMiddleware } from '@libs/common/middlewares/timezone.middleware'
import { TasksService } from '@libs/common/services/task.service'
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { ImModule } from './modules/im/im.module'
import { NotificationModule } from './modules/notification/notification.module'
import { UserModule } from './modules/user/user.module'
import { WeixinModule } from './modules/weixin/weixin.module'

@Module({
  imports: [
    UserModule,
    ImModule,
    WeixinModule,
    CommonModule,
    JwtModuleImport,
    ScheduleModule.forRoot(),
    NotificationModule,
  ],
  providers: [TasksService, DeepSeekFactory],
  exports: [DeepSeekFactory],
})
export class CoreModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TimeZoneMiddleware).forRoutes('*path')
  }
}
