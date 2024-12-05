import { PageDto } from '../dtos/page.dto'

/**
 * transform page to skip and take
 * @param page page info
 * @returns skip and take
 */
export function transformPageToOrmQry(page: PageDto) {
  const { current = 1, size = 10 } = page
  const skip = (current - 1) * size
  const take = size
  return {
    skip,
    take,
  }
}
