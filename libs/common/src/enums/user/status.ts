export enum RegisterUserStatus {
  Success = 0,
  /**
   * 用户信息未补充
   */
  NotAddUserInfo = 1,
  EmailRegistered = 5,
  EmailNotVerified = 2,
  EmailNotRegistered = 3,
  EmailOrPasswordIncorrect = 4,
}
