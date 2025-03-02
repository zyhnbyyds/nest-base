export interface WxTokenRes {
  access_token: string
  expires_in: number
}

export interface WxUserListRes {
  total: number
  count: number
  data: {
    openid: string[]
  }
  next_openid: string
}
