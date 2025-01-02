import { testBootstrap } from '@libs/common/utils/bootstrap'
import { NestFastifyApplication } from '@nestjs/platform-fastify'
import { PrismaClient } from '@zgyh/prisma-mysql'
import Redis from 'ioredis'
import { AuthModule } from '../src/auth.module'

const testRegisterUser = {
  userId: '28382628060000000',
  openId: '28382628060000001',
  email: 'test-register@qq.com',
  password: '123456',
  nickname: 'test-register',
  avatarUrl: 'https://avatars.githubusercontent.com/u/100000000?v=4',
  userName: 'test-register',
  phone: '13456789201',
  gender: 'male',
}

const registerUser = {
  userId: '28382628060000000',
  email: 'test-register@qq.com',
  status: 0,
}

describe('apps-Auth (e2e)', () => {
  let app: NestFastifyApplication
  const redis = new Redis()
  let mysqlClient: PrismaClient
  beforeEach(async () => {
    mysqlClient = new PrismaClient()

    await redis.set('email_service:test-register@qq.com', '222222')
    await redis.set('email_service:test@test.com', '111111')
    await mysqlClient.$connect()

    await mysqlClient.$transaction([
      mysqlClient.user.create({ data: testRegisterUser }),
      mysqlClient.registerUser.create({ data: registerUser }),
    ])

    app = await testBootstrap({
      module: AuthModule,
    })
  })

  it('/auth/sendEmailCode (POST)', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/auth/sendEmailCode',
      payload: {
        email: 'test-send-code@test.com',
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
    expect(res_2.json().data.token).toBeDefined()
    expect(res_2.json().data.verify.status).toBe(1)
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
    expect(res_3.json().data.token).toBeDefined()
    expect(res_3.json().data.verify.status).toBe(0)
  })

  afterEach(async () => {
    await redis.del('email_service:test-register@qq.com')
    await redis.del('email_service:test@test.com')
    await redis.del('email_service:test-send-code@test.com')

    await mysqlClient.$transaction([
      mysqlClient.user.delete({ where: { email: testRegisterUser.email } }),
      mysqlClient.registerUser.delete({ where: { email: registerUser.email } }),
    ])
    await app.close()
  })

  afterAll(async () => {
    await redis.quit()
    await mysqlClient.$disconnect()
  })
})
