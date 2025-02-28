import { SOCKET_EVENT } from '@libs/common/constant/socket-event'
import { ImSendMessageTypeEnum } from '@libs/common/enums/im'
import { RedisCacheKey } from '@libs/common/enums/redis'
import { createTestToken } from '@libs/common/utils/test'
import { PrismaClient as MongoClient } from '@prisma/client'
import { PrismaClient as MysqlClient } from '@prisma/client'
import Redis from 'ioredis'
import { io, Socket } from 'socket.io-client'

const testUserList = [
  {
    userId: '00000000000000111',
    openId: '00000000000000112',
    email: 'im-gateway1@test.com',
    password: '123456',
    nickname: 'test',
    avatarUrl: 'https://avatars.githubusercontent.com/u/100000000?v=4',
    userName: 'test',
    phone: '13456789201',
    gender: 'male',
  },
  {
    userId: '00000000000000113',
    openId: '00000000000000114',
    email: 'im-gateway2@test.com',
    password: '123456',
    nickname: 'test',
    avatarUrl: 'https://avatars.githubusercontent.com/u/100000000?v=4',
    userName: 'test',
    phone: '13456789201',
    gender: 'male',
  },
]

describe('eventsGateway', () => {
  let socket1: Socket
  let socket2: Socket
  let mysqlClient: MysqlClient
  let mongoClient: MongoClient
  let user1Token: string
  let user2Token: string
  let redis: Redis

  beforeAll(async () => {
    mysqlClient = new MysqlClient()
    mongoClient = new MongoClient()

    redis = new Redis()

    await mysqlClient.user.createMany({
      data: testUserList,
    })

    user1Token = await createTestToken({ email: testUserList[0].email, userId: testUserList[0].userId })
    user2Token = await createTestToken({ email: testUserList[1].email, userId: testUserList[1].userId })

    await redis.set(`${RedisCacheKey.AuthToken}${testUserList[0].userId}}`, user1Token)
    await redis.set(`${RedisCacheKey.AuthToken}${testUserList[1].userId}}`, user2Token)
  })

  beforeEach(async () => {
    socket1 = io('http://localhost:3100/im', { auth: { token: user1Token, userId: testUserList[0].userId } })
    socket2 = io('http://localhost:3100/im', { auth: { token: user2Token, userId: testUserList[1].userId } })

    await Promise.all([
      new Promise((resolve) => {
        socket1.on('connect', () => {
          resolve(true)
        })
      }),
      new Promise((resolve) => {
        socket2.on('connect', () => {
          resolve(true)
        })
      }),
    ])
  })

  describe('chat event', () => {
    it('sned hello get world', async () => {
      const imUserInfo1 = await socket1.emitWithAck(SOCKET_EVENT.LOGIN)
      const imUserInfo2 = await socket2.emitWithAck(SOCKET_EVENT.LOGIN)

      expect(imUserInfo1.data.userId).toBe(testUserList[0].userId)
      expect(imUserInfo2.data.userId).toBe(testUserList[1].userId)

      socket1.emit(SOCKET_EVENT.SEND_MESSAGE, {
        content: 'nice to meet you',
        messageType: ImSendMessageTypeEnum.TEXT,
        toUser: testUserList[1].userId,
      })

      await Promise.all([
        new Promise((resolve) => {
          socket2.on(SOCKET_EVENT.RECEIVE_MESSAGE, async (data) => {
            expect(data.content).toBe('nice to meet you')
            socket2.emit(SOCKET_EVENT.SEND_MESSAGE, {
              content: 'me too',
              messageType: ImSendMessageTypeEnum.TEXT,
              toUser: testUserList[0].userId,
            })
            resolve(true)
          })
        }),
        new Promise((resolve) => {
          socket1.on(SOCKET_EVENT.RECEIVE_MESSAGE, async (data) => {
            expect(data.content).toBe('me too')
            resolve(true)
          })
        }),
      ])
    })
  })

  afterEach(async () => {
    socket1.disconnect()
    socket2.disconnect()

    await redis.del(`${RedisCacheKey.AuthToken}${testUserList[0].userId}}`)
    await redis.del(`${RedisCacheKey.AuthToken}${testUserList[1].userId}}`)

    await mysqlClient.user.deleteMany({ where: { userId: { in: testUserList.map(user => user.userId) } } })
    await mongoClient.imUser.deleteMany({ where: { userId: { in: testUserList.map(user => user.userId) } } })
  })

  afterAll(async () => {
    await mysqlClient.$disconnect()
    await mongoClient.$disconnect()
    await redis.quit()
  })
})
