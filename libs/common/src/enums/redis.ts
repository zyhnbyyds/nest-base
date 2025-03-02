export enum RedisCacheKey {
  AuthToken = 'auth:token:',
  SocketId = 'socket:id:',
  UserId = 'user:id:',
  UserInfo = 'user:info:',
  UserEmail = 'user:email:',
  UserEmailVerifyCode = 'user:email:verify:code:',
  UserEmailVerifyCodeExpire = 'user:email:verify:code:expire:',
  UserEmailVerifyCodeCount = 'user:email:verify:code:count:',

  // WX
  WxServerToken = 'wx:server:token',
  WxServerTokenExpire = 'wx:server:expire',
}
