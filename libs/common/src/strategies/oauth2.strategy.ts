import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-oauth2'

@Injectable()
export class OAuth2Strategy extends PassportStrategy(Strategy, 'oauth2') {
  constructor() {
    super({
      authorizationURL: 'http://localhost:3005/auth/oauth2/authorize',
      tokenURL: 'http://localhost:3005/auth/oauth2/token',
      clientID: 'your-client-id',
      clientSecret: 'your-client-secret',
      callbackURL: 'http://localhost:4173/auth/oauth2/callback',
    })
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    return { accessToken, profile }
  }
}
