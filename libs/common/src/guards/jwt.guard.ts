import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { FastifyRequest } from 'fastify'
import Redis from 'ioredis'
import { AuthConfig } from '../config/interface'
import { FactoryName } from '../enums/factory'
import { RedisCacheKey } from '../enums/redis'

@Injectable()
export class AuthJwtGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,

    private configService: ConfigService,

    @Inject(FactoryName.RedisFactory)
    private redis: Redis,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const token = this.extractTokenFromHeader(request)
    if (!token) {
      throw new UnauthorizedException()
    }
    try {
      const { secret } = this.configService.get<AuthConfig>('jwt')
      const payload = await this.jwtService.verifyAsync<{ userId: number, email: string }>(
        token,
        {
          secret,
        },
      )
      const cacheToken = await this.redis.get(`${RedisCacheKey.AuthToken}${payload.userId}`)
      if (cacheToken !== token || !cacheToken) {
        throw new UnauthorizedException()
      }
      request.verify = payload
    }
    catch {
      throw new UnauthorizedException()
    }
    return true
  }

  private extractTokenFromHeader(request: FastifyRequest): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}
