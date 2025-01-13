import { inspect } from 'node:util'
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { FastifyReply, FastifyRequest } from 'fastify'
import { isObject } from 'lodash'
import { Result } from '../utils/result'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor() {}
  catch(exception: unknown, next: ArgumentsHost) {
    const host = next.switchToHttp()
    const response = host.getResponse<FastifyReply>()
    const request = host.getRequest<FastifyRequest>()
    const status
      = exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR

    Logger.error(
      `${request.method} ${request.url} reason -> ${
        isObject(exception) ? inspect(exception, { depth: null, colors: true }) : exception
      }`,
    )

    response.status(status <= 500 ? 200 : status).send(Result.fail(exception, status))
  }
}
