import { Injectable, OnModuleInit } from '@nestjs/common'
import { PrismaClient as ClientMongo } from 'prisma-mongo'
import { PrismaClient as ClientMysql } from 'prisma-mysql'

@Injectable()
export class MysqlService extends ClientMysql implements OnModuleInit {
  async onModuleInit() {
    await this.$connect()
  }
}

@Injectable()
export class MongoService extends ClientMongo implements OnModuleInit {
  async onModuleInit() {
    await this.$connect()
  }
}
