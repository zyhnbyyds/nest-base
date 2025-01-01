import { testBootstrap } from '@libs/common/utils/bootstrap'
import { NestFastifyApplication } from '@nestjs/platform-fastify'
import Redis from 'ioredis'
import { AuthModule } from '../src/auth.module'

describe('authController', () => {
  let app: NestFastifyApplication

  beforeEach(async () => {
    app = await testBootstrap({
      module: AuthModule,
    })
  })

  it('/auth/sendEmailCode (POST)', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/auth/sendEmailCode',
      payload: {
        email: 'test@test111.com',
      },
    })
    expect(res.statusCode).toBe(200)
    expect(res.json().code).toBe(0)
  })

  it('/auth/loginUseEmail (POST) (error1: email-code error)', async () => {
    const res_1 = await app.inject({
      method: 'POST',
      url: '/auth/loginUseEmail',
      payload: {
        email: 'test@test.com',
        code: '111112',
      },
    })
    expect(res_1.statusCode).toBe(200)
    expect(res_1.json().code).toBe(1)
  })

  it('/auth/loginUseEmail (POST) (correct1: email-code -> not register user)', async () => {
    const res_2 = await app.inject({
      method: 'POST',
      url: '/auth/loginUseEmail',
      payload: {
        email: 'test@test.com',
        code: '111111',
      },
    })
    expect(res_2.statusCode).toBe(200)
    expect(res_2.json().code).toBe(0)
  })

  it('/auth/loginUseEmail (POST) (correct2: email-code -> registered user)', async () => {
    const res_3 = await app.inject({
      method: 'POST',
      url: '/auth/loginUseEmail',
      payload: {
        email: 'test-register@qq.com',
        code: '222222',
      },
    })
    expect(res_3.statusCode).toBe(200)
    expect(res_3.json().code).toBe(0)
  })

  afterEach(async () => {
    await app.close()
  })
})
