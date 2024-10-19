import { MongoService } from '@libs/common/services/prisma.service'
import { Result } from '@libs/common/utils/result'
import { Injectable } from '@nestjs/common'
import { CreateImUserDto } from './dto/create-im-user.dto'

@Injectable()
export class ImUserService {
  constructor(private prisma: MongoService) {}

  async login(userId: string) {
    const imUser = await this.findOne(userId)
    if (imUser)
      return imUser
    return await this.create({ userId })
  }

  async create(createImUserDto: CreateImUserDto) {
    const imUser = await this.prisma.imUser.create({ data: createImUserDto })
    return Result.success(imUser)
  }

  findAll() {
    return `This action returns all imUser`
  }

  async findOne(userId: string) {
    const imUser = await this.prisma.imUser.findUnique({ where: { userId, id: null } })
    return Result.success(imUser)
  }

  remove(id: number) {
    return `This action removes a #${id} imUser`
  }
}
