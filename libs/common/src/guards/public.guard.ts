import { SetMetadata } from '@nestjs/common'

export const Public = () => SetMetadata(process.env.AUTH_PUBLIC_KEY, true)
