import { Injectable } from '@nestjs/common'
import { User } from '@prisma/client'
import { PrismaService } from 'common/common/services/prisma.service'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async create(createUserDto: User) {
    return await this.prisma.user.create({ data: createUserDto, select: { userId: true, openId: true } })
  }

  findAll() {
    return this.prisma.user.findMany()
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
