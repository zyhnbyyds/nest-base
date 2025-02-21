import { FastifyRequest } from 'fastify'

export interface FastifyRequestWithAuth extends FastifyRequest {
  verify: TUserVerify
}

export interface TUserVerify {
  userId: string
  email: string
}
