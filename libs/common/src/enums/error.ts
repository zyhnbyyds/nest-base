/**
 * error msg enum 错误信息枚举
 */
export enum EmailErrorMsg {
  /**
   * email is registered 邮箱已经注册
   */
  EmailRegistered = '邮箱已经注册',
  /**
   * email is not registered 邮箱未注册
   */
  EmailNotRegistered = '邮箱未注册',
  /**
   * email or password is incorrect 邮箱或密码不正确
   */
  EmailOrPasswordIncorrect = '邮箱或密码不正确',
  /**
   * email is not verified 邮箱未验证
   */
  EmailNotVerified = '邮箱未验证',

  EmailVerifyCodeNotGet = '请先获取邮箱验证码',

  EmailVerifyCodeError = '邮箱验证码错误',

  EmailVerifyCodeExpired = '邮箱验证码已过期',

  EmailVerifyCodeSendSuccess = '邮箱验证码发送成功',

  EmailVerifySuccess = '邮箱验证成功',

  EmailSendSuccess = '邮件发送成功',

  InvalidToken = '无效的token',

  InvalidRefreshToken = '无效的refresh token',

  InvalidTokenType = '无效的token类型',

  InvalidRefreshTokenType = '无效的refresh token类型',
}

export enum UserErrorMsg {
  RegisterUserNotFound = '注册用户不存在',
  UserNotFound = '用户不存在',
  UserAlreadyExists = '用户已存在',
  UserDisabled = '用户已禁用',
  UserNotVerified = '用户未验证',
  UserNotActive = '用户未激活',
  UserNotVerifiedEmail = '用户未验证邮箱',
  UserNotVerifiedPhone = '用户未验证手机号',
}

export enum CommonErrorMsg {
  InvalidParam = '无效的参数',
  InvalidParamType = '无效的参数类型',
  InvalidParamValue = '无效的参数值',
  InvalidParamFormat = '无效的参数格式',
  InvalidParamLength = '无效的参数长度',
  InvalidParamRange = '无效的参数范围',
  InvalidParamRangeMin = '无效的参数最小值',
  InvalidParamRangeMax = '无效的参数最大值',
  UnknownError = '未知错误',
}
