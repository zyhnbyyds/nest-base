import { RedisCacheKey } from '@libs/common/enums/redis'
import { SubAppRoutePrefixEnum } from '@libs/common/enums/subapps'
import { testBootstrap } from '@libs/common/utils/bootstrap'
import { JwtService } from '@nestjs/jwt'
import { NestFastifyApplication } from '@nestjs/platform-fastify'
import { PrismaClient } from '@zgyh/prisma-mysql'
import Redis from 'ioredis'
import { CoreModule } from '../src/core.module'

const testUser = {
  userId: '28382628061111111',
  openId: '28382628060000001',
  email: 'test-core@test.com',
  password: '123456',
  nickname: 'test',
  avatarUrl: 'https://avatars.githubusercontent.com/u/100000000?v=4',
  userName: 'test',
  phone: '13456789201',
  gender: 'male',
}

describe('apps-Core (e2e)', () => {
  let app: NestFastifyApplication
  let token: string
  let jwtService: JwtService

  const redis = new Redis()
  let mysqlClient: PrismaClient
  beforeEach(async () => {
    mysqlClient = new PrismaClient()
    jwtService = new JwtService()

    await redis.set(`email_service:${testUser.email}`, '111111')
    token = await jwtService.signAsync({ email: testUser.email, userId: testUser.userId }, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN,
    })

    await redis.set(`${RedisCacheKey.AuthToken}${testUser.userId}`, token)
    await mysqlClient.$connect()

    await mysqlClient.$transaction([
      mysqlClient.user.create({ data: testUser }),
    ])

    app = await testBootstrap({
      module: CoreModule,
    })

    app.setGlobalPrefix(SubAppRoutePrefixEnum.Core)
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

  afterEach(async () => {
    await redis.del(`${RedisCacheKey.AuthToken}${testUser.userId}`)
    await mysqlClient.$transaction([
      mysqlClient.user.delete({ where: { email: testUser.email } }),
    ])
    await app.close()
  })

  afterAll(async () => {
    await redis.quit()
    await mysqlClient.$disconnect()
  })
})
