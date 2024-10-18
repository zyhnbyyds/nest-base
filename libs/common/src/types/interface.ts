import { FastifyRequest } from 'fastify'

export interface FastifyRequestWithAuth extends FastifyRequest {
  verify: {
    userId: string
    email: string
  }
}
