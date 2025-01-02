import { RedisCacheKey } from '@libs/common/enums/redis'
import { SubAppRoutePrefixEnum } from '@libs/common/enums/subapps'
import { testBootstrap } from '@libs/common/utils/bootstrap'
import { JwtService } from '@nestjs/jwt'
import { NestFastifyApplication } from '@nestjs/platform-fastify'
import { PrismaClient } from '@zgyh/prisma-mysql'
import Redis from 'ioredis'
import { CoreModule } from '../src/core.module'

const testUser = {
  userId: '28382628061111222',
  openId: '28382628060000001',
  email: 'test-core@test.com',
  password: '123456',
  nickname: 'test',
  avatarUrl: 'https://avatars.githubusercontent.com/u/100000000?v=4',
  userName: 'test',
  phone: '13456789201',
  gender: 'male',
}

const mockCreateUserDtoWithoutEmail = {
  password: 'myp@ssw0rd',
  nickname: 'JohnDoe',
  avatarUrl: 'https://example.com/avatar.jpg',
  gender: 'male',
  language: 'zh-CN',
  province: 'Guangdong',
  country: 'China',
  phone: '18733277763',
}

const mockRegisteredUser = {
  userId: '28382628061111223',
  email: 'test-dd@test.com',
  status: 1,
}

describe('apps-Core (e2e)', () => {
  let app: NestFastifyApplication
  let token: string
  let registerToken: string
  let jwtService: JwtService

  const redis = new Redis()
  let mysqlClient: PrismaClient
  beforeEach(async () => {
    mysqlClient = new PrismaClient()
    jwtService = new JwtService()

    const jwtOptions = {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN,
    }

    token = await jwtService.signAsync({ email: testUser.email, userId: testUser.userId }, jwtOptions)
    registerToken = await jwtService.signAsync({ email: mockRegisteredUser.email, userId: mockRegisteredUser.userId }, jwtOptions)

    await redis.set(`${RedisCacheKey.AuthToken}${testUser.userId}`, token)
    await redis.set(`${RedisCacheKey.AuthToken}${mockRegisteredUser.userId}`, registerToken)

    await mysqlClient.$connect()

    await mysqlClient.$transaction([
      mysqlClient.user.create({ data: testUser }),
      mysqlClient.registerUser.create({ data: mockRegisteredUser }),
    ])

    app = await testBootstrap({
      module: CoreModule,
    })
  })

  it('/core/user/userInfo (POST)', async () => {
    const { json, statusCode } = await app.inject({
      method: 'GET',
      url: '/user/userInfo',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    expect(statusCode).toBe(200)
    expect(json().code).toBe(0)
    expect(json().data.user.userId).toBe(testUser.userId)
  })

  it('/core/user/list (GET)', async () => {
    const { json, statusCode } = await app.inject({
      method: 'GET',
      url: '/user/list',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      query: {
        userName: testUser.userName,
        email: testUser.email,
      },
    })

    expect(statusCode).toBe(200)
    expect(json().code).toBe(0)
    expect(json().data.list.length).toBe(1)
    expect(json().data.list[0].userId).toBe(testUser.userId)
  })

  it('/core/user/createUserFromRegisterUser (POST)', async () => {
    const { json, statusCode } = await app.inject({
      method: 'POST',
      url: '/user/createUserFromRegisterUser',
      headers: {
        Authorization: `Bearer ${registerToken}`,
      },
      payload: mockCreateUserDtoWithoutEmail,
    })

    expect(statusCode).toBe(200)
    expect(json().code).toBe(0)
  })

  afterEach(async () => {
    await redis.del(`${RedisCacheKey.AuthToken}${testUser.userId}`)
    await redis.del(`${RedisCacheKey.AuthToken}${mockRegisteredUser.userId}`)

    await mysqlClient.$transaction([
      mysqlClient.user.deleteMany({ where: { userId: { in: [testUser.userId, mockRegisteredUser.userId] } } }),
      mysqlClient.registerUser.delete({ where: { userId: mockRegisteredUser.userId } }),
    ])
    await app.close()
  })

  afterAll(async () => {
    await redis.quit()
    await mysqlClient.$disconnect()
  })
})
