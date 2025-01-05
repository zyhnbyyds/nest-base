/**
 * email expire time 邮箱验证码过期时间
 * @default 5min
 */
export const EMAIL_CODE_EXPIRE_TIME = 1000 * 60 * 5

/**
 * default success result msg 默认成功返回信息
 */
export const DEFAULT_SUCCESS_RESULT_MSG = 'success'

/**
 * default success result code 默认成功返回码
 */
export const DEFAULT_SUCCESS_RESULT_CODE = 0

/**
 * default error result code 默认失败返回码
 */
export const DEFAULT_ERROR_RESULT_CODE = 1

export const NATS_TIMEOUT = 10000

// about socket.io
export const SOCKET_TIMEOUT = 30000

export const SOCKET_PING_INTERVAL = 2000

export const SOCKET_PING_TIMEOUT = 5000

export const SOCKET_NAMESPACE_IM = 'im'

export const SOCKET_ORIGIN_EXCLUDE = [
  'https://admin.socket.io',
  'http://localhost:3300',
  '*',
]
