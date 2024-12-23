import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common'
import { FastifyReply, FastifyRequest } from 'fastify'
import { Result } from '../utils/result'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<FastifyReply>()
    const request = ctx.getRequest<FastifyRequest>()
    const status = exception.getStatus()

    Logger.error(
      `error==>${request.method} ${request.url} reason==>${
        exception
      }`,
    )
    response
      .status(status <= 500 ? 200 : status)
      .send(Result.fail(exception, status))
  }
}
