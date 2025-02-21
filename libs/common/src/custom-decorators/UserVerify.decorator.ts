import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { FastifyRequestWithAuth } from '../types/interface'

/**
 * 获取用户信息
 */
export const UserVerify = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<FastifyRequestWithAuth>()

  return request.verify
})
