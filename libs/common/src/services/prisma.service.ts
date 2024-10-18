import { PrismaClient as ClientMongo } from '@clients/mongo'
import { PrismaClient as ClientMysql } from '@clients/mysql'
import { Injectable, OnModuleInit } from '@nestjs/common'

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
