import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { FastifyReply, FastifyRequest } from 'fastify'
import { isObject } from 'lodash'
import { WLogger } from '../utils/logger'
import { Result } from '../utils/result'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, next: ArgumentsHost) {
    const host = next.switchToHttp()
    const response = host.getResponse<FastifyReply>()
    const request = host.getRequest<FastifyRequest>()
    const status
      = exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR

    WLogger.error(
      `${request.method} ${request.url} reason -> ${
        isObject(exception) ? JSON.stringify(exception) : exception
      }`,
    )
    response.status(status).send(Result.fail(exception, status))
  }
}
