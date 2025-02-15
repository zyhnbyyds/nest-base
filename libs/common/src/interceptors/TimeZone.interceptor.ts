import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { FastifyRequest } from 'fastify'
import { isObject } from 'lodash'
import { DateTime } from 'luxon'
import { map } from 'rxjs/operators'

@Injectable()
export class TimezoneInterceptor implements NestInterceptor {
  private readonly constantFields = new Set(['createdAt'])

  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest<FastifyRequest>()
    const timezone = (request.headers.timezone || 'UTC') as string

    const [include, exclude] = this.parseHeaders(request.headers)
    const includeFields = [...this.constantFields, ...include]

    return next.handle().pipe(
      map(data => this.transform(data, timezone, includeFields, exclude)),
    )
  }

  private parseHeaders(headers: FastifyRequest['headers']): [string[], string[]] {
    const parse = (val?: string) => val?.split(',').filter(Boolean) || []
    return [
      parse(headers['time-zone-include'] as string),
      parse(headers['time-zone-exclude'] as string),
    ]
  }

  private transform(
    data: unknown,
    tz: string,
    include: string[],
    exclude: string[],
  ): unknown {
    if (data instanceof Date) {
      return DateTime.fromJSDate(data).setZone(tz).toISO()
    }

    if (typeof data === 'string') {
      const dt = DateTime.fromISO(data, { zone: tz })
      return dt.isValid ? dt.toISO() : data
    }

    if (Array.isArray(data)) {
      return data.map(item => this.transform(item, tz, include, exclude))
    }

    if (data && typeof data === 'object') {
      return Object.fromEntries(
        Object.entries(data).map(([key, value]) => [
          key,
          this.shouldTransform(key, value, include, exclude)
            ? this.transform(value, tz, include, exclude)
            : value,
        ]),
      )
    }

    return data
  }

  private shouldTransform(key: string, value: unknown, include: string[], exclude: string[]): boolean {
    if (exclude.includes(key))
      return false
    return include.length === 0 || include.includes(key) || value instanceof Date || (value && isObject(value))
  }
}
