import { UserErrorMsg } from '@libs/common/enums/error'
import { MysqlService } from '@libs/common/services/prisma.service'
import { transformPageToOrmQry } from '@libs/common/utils/page'
import { Result } from '@libs/common/utils/result'
import { Snowflake } from '@libs/common/utils/snow-flake'
import { Injectable, Logger } from '@nestjs/common'
import { User } from '@zgyh/prisma-mysql'
import { omit } from 'lodash'
import { CreateUserDto, CreateUserDtoWithoutEmail } from './dto/createUser.dto'
import { GetUserListDto } from './dto/get-user-list-dto'

@Injectable()
export class UserService {
  constructor(private mysqlService: MysqlService) {}

  async create(createUserDto: CreateUserDto, userId: string = '') {
    const snowflake = new Snowflake(1, 1)

    const resCreateInfo = await this.mysqlService.user.create({ data: {
      ...createUserDto,
      userId: userId || snowflake.generateId(),
      lastLoginTime: null,
      isDelete: false,
      openId: snowflake.generateId(),
    }, select: { userId: true, openId: true } })

    return resCreateInfo
  }

  async findAll(query: GetUserListDto) {
    try {
      const queryExcludePage = omit(query, ['current', 'size'])

      const userList = await this.mysqlService.user.findMany({ where: { ...queryExcludePage }, ...transformPageToOrmQry(query) })
      const total = await this.mysqlService.user.count({ where: { ...queryExcludePage } })
      return Result.list(userList, total)
    }
    catch (error) {
      Logger.error(error)
      return Result.fail(error)
    }
  }

  async findOne(userId: string) {
    const user = await this.mysqlService.user.findUnique({ where: { userId } })
    const registerUser = await this.mysqlService.registerUser.findUnique({ where: { userId } })

    if (!user && !registerUser) {
      return Result.fail(UserErrorMsg.UserNotFound)
    }
    if (!user && registerUser) {
      return Result.success({ registerUser, user: null })
    }
    return Result.success({ user, registerUser: null })
  }

  update(userId: string, updateUserDto: User) {
    return this.mysqlService.user.update({ data: updateUserDto, where: { userId } })
  }

  remove(userId: string) {
    return this.mysqlService.user.delete({ where: { userId } })
  }

  async createUserFromRegisterUser(user: CreateUserDtoWithoutEmail, verify: {
    userId: string
    email: string
  }) {
    await this.create({ ...user, email: verify.email }, verify.userId)
    return Result.ok()
  }
}
