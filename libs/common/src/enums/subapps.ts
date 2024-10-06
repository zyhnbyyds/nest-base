/**
 * 子应用枚举
 */
export enum SubAppEnum {
  Auth = 'auth',
  Core = 'core',
  Logger = 'logger',
  Email = 'email',
}

/**
 * 子应用路由前缀
 */
export enum SubAppRoutePrefixEnum {
  Auth = '/auth',
  Core = '/core',
  Logger = '/logger',
  Email = '/email',
}

/**
 * 子应用端口
 */
export enum SubAppPortEnum {
  Auth = 3005,
  Core = 3001,
  Logger = 3004,
  Email = 3006,
}

/** 微服务事件 */
export enum MicroServicesEventEnum {
  /** 写日志 */
  WRITE_LOG = 'event~write_log',
}

/** 微服务消息参数 */
export enum MicroServiceMessageEnum {
  /** 发邮件 */
  SEND_EMAIL = 'message~send_email',
}

/**
 * 微服务名称
 */
export enum MicroServiceNameEnum {
  /** 日志微服务 */
  LOGGER_SERVICE = 'logger_service',
  /** 邮件微服务 */
  EMAIL_SERVICE = 'email_service',
}
