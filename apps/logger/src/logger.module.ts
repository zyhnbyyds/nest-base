import { CommonModule } from '@libs/common'
import { Module } from '@nestjs/common'
import { RecordModule } from './record/record.module'

@Module({
  imports: [RecordModule, CommonModule],
  controllers: [],
  providers: [],
})
export class LoggerModule {}
