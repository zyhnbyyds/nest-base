import { Injectable } from '@nestjs/common'
import { User } from '@prisma/client'
import { PrismaService } from './prisma.service'

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async createUser() {
    return await this.prisma.user.create({
      data: {
        email: 'test@test.com',
        name: 'test',
      },
    })
  }

  async getUsers(): Promise<User[]> {
    return await this.prisma.user.findMany()
  }
}
