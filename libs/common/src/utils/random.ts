import { Logger } from '@nestjs/common'

/**
 * 生成一个指定长度的随机字符串，这个字符串包含大写字母、小写字母和数字。
 *
 * @param length - 随机字符串的长度
 * @returns 返回生成的随机字符串
 */
export function randomCode(length: number): string {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < length; i++)
    result += characters.charAt(Math.floor(Math.random() * characters.length))

  Logger.log(`Generated random code: ${result}`)

  return result
}
