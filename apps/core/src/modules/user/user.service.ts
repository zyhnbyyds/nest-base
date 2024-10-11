import { PrismaService } from '@libs/common/services/prisma.service'
import { WLogger } from '@libs/common/utils/logger'
import { Result } from '@libs/common/utils/result'
import { Injectable } from '@nestjs/common'
import { User } from '@prisma/client'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: User) {
    return await this.prisma.user.create({ data: createUserDto, select: { userId: true, openId: true } })
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
