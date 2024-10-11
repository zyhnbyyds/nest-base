import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common'
import { FastifyReply, FastifyRequest } from 'fastify'
import { WLogger } from '../utils/logger'
import { Result } from '../utils/result'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<FastifyReply>()
    const request = ctx.getRequest<FastifyRequest>()
    const status = exception.getStatus()

    WLogger.error(
      `error==>${request.method} ${request.url} reason==>${
        exception
      }`,
    )
    response
      .status(status)
      .send(Result.fail(exception, status))
  }
}
