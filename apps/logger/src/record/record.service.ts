import { Injectable } from '@nestjs/common'

@Injectable()
export class RecordService {
  create() {
    return 'This action adds a new record'
  }

  findAll() {
    return `This action returns all record`
  }

  findOne(id: number) {
    return `This action returns a #${id} record`
  }

  update(id: number) {
    return `This action updates a #${id} record`
  }

  remove(id: number) {
    return `This action removes a #${id} record`
  }
}
