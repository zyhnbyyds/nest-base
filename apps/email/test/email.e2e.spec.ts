import { combineEmailOptions } from '@libs/common/utils/email'
import { INestMicroservice } from '@nestjs/common'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { Test } from '@nestjs/testing'
import Redis from 'ioredis'
import { EmailController } from '../src/email.controller'
import { EmailModule } from '../src/email.module'

describe('microApps-Email (e2e)', () => {
  let controller: EmailController
  let redis: Redis
  let emailApp: INestMicroservice

  beforeEach(async () => {
    redis = new Redis()
    const moduleRef = await Test.createTestingModule({
      imports: [EmailModule],
    }).compile()

    emailApp = moduleRef.createNestMicroservice<MicroserviceOptions>({
      transport: Transport.NATS,
    })

    await emailApp.init()

    controller = emailApp.get(EmailController)
  })

  it('should call service method and return result', async () => {
    const [options, _code] = combineEmailOptions({ to: '1873329653@qq.com' })
    const result = await controller.sendEmail(options)
    expect(result).toBe(true)
  })

  afterEach(async () => {
    await redis.quit()
    await emailApp.close()
  })
})
