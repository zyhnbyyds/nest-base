import { JwtService } from '@nestjs/jwt'

const jwtOptions = {
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRES_IN,
}

export function createTestToken<T extends object>(verifyOptions: T) {
  const jwtService = new JwtService({
    secret: process.env.JWT_SECRET,
    signOptions: {
      expiresIn: process.env.JWT_EXPIRES_IN,
    },
  })

  return jwtService.signAsync(verifyOptions, jwtOptions)
}
