import { UserErrorMsg } from '@libs/common/enums/error'
import { RegisterUserStatus } from '@libs/common/enums/user/status'
import { PrismaService } from '@libs/common/services/prisma.service'
import { YYYYMMDDHHmmss } from '@libs/common/utils/dayjs'
import { Result } from '@libs/common/utils/result'
import { Snowflake } from '@libs/common/utils/snow-flake'
import { Injectable } from '@nestjs/common'
import { User } from '@prisma/client'
import { CreateUserDto } from './dto/createUser.dto'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

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

  async findAll() {
    const userList = await this.prisma.user.findMany()
    return Result.success(userList)
  }

  findOne(userId: string) {
    return this.prisma.user.findUniqueOrThrow({ where: { userId } })
  }

  update(userId: string, updateUserDto: User) {
    return this.prisma.user.update({ data: updateUserDto, where: { userId } })
  }

  remove(userId: string) {
    return this.prisma.user.delete({ where: { userId } })
  }
}
