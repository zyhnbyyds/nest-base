import { Injectable, NestMiddleware } from '@nestjs/common'
import { FastifyReply, FastifyRequest } from 'fastify'

@Injectable()
export class TimeZoneMiddleware implements NestMiddleware {
  use(req: FastifyRequest['raw'], _res: FastifyReply['raw'], next: () => void) {
    const userTimeZone = req.headers['user-timezone'] as string
    const xTimeZone = req.headers['x-timezone'] as string

    const timezone = userTimeZone || xTimeZone || 'UTC'
    req.headers.timezone = timezone

    next()
  }
}
