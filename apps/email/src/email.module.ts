import { CommonModule } from '@libs/common'
import { TransportFactory } from '@libs/common/factories/transporter.factory'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { EmailController } from './email.controller'
import { EmailService } from './email.service'

@Module({
  imports: [
    ConfigModule.forRoot(),
    CommonModule,
  ],
  controllers: [EmailController],
  providers: [EmailService, TransportFactory],
})
export class EmailModule {}
