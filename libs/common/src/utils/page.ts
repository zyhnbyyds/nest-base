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

/**
 * 把对象空值转为null
 * @param target 目标对象
 * @returns
 */
export function transformEmptyParamsToNull<T extends object>(target: object) {
  return Object.keys(target).reduce((acc, key) => {
    if (target[key] === '') {
      acc[key] = null
    }
    else {
      acc[key] = target[key]
    }
    return acc
  }, {} as T)
}

/**
 * 过滤空属性值
 * @param target 目标对象
 * @returns
 */
export function filterEmptyParams<T extends object>(target: object) {
  return Object.keys(target).reduce((acc, key) => {
    if (target[key] !== undefined && target[key] !== null && target[key] !== '') {
      acc[key] = target[key]
    }
    return acc
  }, {} as T)
}
