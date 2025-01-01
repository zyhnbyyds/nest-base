import { testBootstrap } from '@libs/common/utils/bootstrap'
import { NestFastifyApplication } from '@nestjs/platform-fastify'
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
        email: 'test@test.com',
      },
    })
    expect(res.statusCode).toBe(200)
    expect(res.json().code).toBe(0)
  })

  it('/auth/loginUseEmail (POST)', async () => {
    const res_1 = await app.inject({
      method: 'POST',
      url: '/auth/loginUseEmail',
      payload: {
        email: 'test@test.com',
        code: '123456',
      },
    })
    expect(res_1.statusCode).toBe(200)
    expect(res_1.json().code).toBe(1)
  })

  afterEach(async () => {
    await app.close()
  })
})
