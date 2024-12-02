import { PageDto } from '../dtos/page.dto'

/**
 * transform page to skip and take
 * @param page page info
 * @returns skip and take
 */
export function transformPage(page: PageDto) {
  const { current, size } = page
  const skip = (current - 1) * size
  const take = size
  return {
    skip,
    take,
  }
}
