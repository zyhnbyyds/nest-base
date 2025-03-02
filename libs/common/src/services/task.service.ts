import { Inject, Injectable, Logger } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { NatsConnection } from 'nats'
import OpenAI from 'openai'
import { FactoryName } from '../enums/factory'

@Injectable()
export class TasksService {
  constructor(
    @Inject(FactoryName.DeepSeekFactory)
    private deepSeek: OpenAI,
    @Inject(FactoryName.NatsFactory)
    private nats: NatsConnection,
  ) {}

  @Cron('54 * * * *')
  async handleCron() {
    const start = Date.now()
    try {
      const completion = await this.deepSeek.chat.completions.create({
        model: 'deepseek-reasoner',
        messages: [
          { role: 'system', content: '新闻评论员，每个回答需要标明日期，并起一个符合的标题' },
          { role: 'user', content: '总结今日的大事件' },
        ],
      })
      const end = Date.now()

      this.nats.publish('deepseek.chat.completions', JSON.stringify({
        content: completion.choices[0].message.content,
        time: end - start,
      }))
    }
    catch (error) {
      Logger.error(error)
    }
  }
}
