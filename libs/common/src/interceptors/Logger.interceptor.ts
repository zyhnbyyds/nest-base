import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common'
import { FastifyRequest } from 'fastify'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<FastifyRequest>()

    const before = Date.now()
    return next
      .handle()
      .pipe(
        tap(() => {
          const response = context.switchToHttp().getResponse()

          const payload = {
            method: request.method,
            url: request.url,
            headers: request.headers,
            cookies: request.cookies,
            params: request.params,
            query: request.query,
            body: request.body,
            statusCode: response.statusCode,
          }

          Logger.log({
            message: `payload => ${JSON.stringify(payload)} -> spend ${Date.now() - before}ms`,
            logLevel: 'info',
          })
        }),
      )
  }
}
