import { UserErrorMsg } from '@libs/common/enums/error'
import { RegisterUserStatus } from '@libs/common/enums/user/status'
import { MysqlService } from '@libs/common/services/prisma.service'
import { YYYYMMDDHHmmss } from '@libs/common/utils/moment'
import { transformPageToOrmQry } from '@libs/common/utils/page'
import { Result } from '@libs/common/utils/result'
import { Snowflake } from '@libs/common/utils/snow-flake'
import { Injectable, Logger } from '@nestjs/common'
import { User } from '@zgyh/prisma-mysql'
import { omit } from 'lodash'
import { CreateUserDto } from './dto/createUser.dto'
import { GetUserListDto } from './dto/get-user-list-dto'

@Injectable()
export class UserService {
  constructor(private prisma: MysqlService) {}

  async create(createUserDto: CreateUserDto, isAutoGenUserId = true) {
    const snowflake = new Snowflake(1, 1)
    if (!isAutoGenUserId) {
      const registerUser = await this.prisma.registerUser.findUnique({ where: { userId: createUserDto.userId } })
      if (!registerUser) {
        return Result.fail(UserErrorMsg.RegisterUserNotFound)
      }

      if (registerUser.status === RegisterUserStatus.Success) {
        return Result.fail(UserErrorMsg.UserAlreadyExists)
      }
    }

    const toCreateUser = isAutoGenUserId
      ? {
          ...createUserDto,
          userId: snowflake.generateId(),
        }
      : createUserDto

    const resCreateInfo = await this.prisma.user.create({ data: {
      ...toCreateUser,
      lastLoginTime: null,
      createdAt: YYYYMMDDHHmmss(),
      updatedAt: null,
      isDelete: false,
      openId: snowflake.generateId(),
    }, select: { userId: true, openId: true } })

    await this.prisma.registerUser.update({ where: { userId: resCreateInfo.userId }, data: { status: RegisterUserStatus.Success } })

    return resCreateInfo
  }

  async findAll(query: GetUserListDto) {
    try {
      const queryExcludePage = omit(query, ['current', 'size'])

      const userList = await this.prisma.user.findMany({ where: { ...queryExcludePage }, ...transformPageToOrmQry(query) })
      const total = await this.prisma.user.count({ where: { ...queryExcludePage } })
      return Result.list(userList, total)
    }
    catch (error) {
      Logger.error(error)
      return Result.fail(error)
    }
  }

  async findOne(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { userId } })
    if (!user) {
      return Result.fail(UserErrorMsg.UserNotFound)
    }
    return Result.success(user)
  }

  update(userId: string, updateUserDto: User) {
    return this.prisma.user.update({ data: updateUserDto, where: { userId } })
  }

  remove(userId: string) {
    return this.prisma.user.delete({ where: { userId } })
  }
}
