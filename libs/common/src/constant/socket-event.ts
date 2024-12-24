/**
 * socket 事件
 */
export const SOCKET_EVENT = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  CONNECTION: 'connection',
  MESSAGE: 'message',
  ERROR: 'error',
  READY: 'ready',
  JOIN_ROOM: 'joinRoom',
  SEND_MESSAGE: 'sendMessage',
  RECEIVE_MESSAGE: 'receiveMessage',
  LEAVE_ROOM: 'leaveRoom',
  READ_MESSAGE: 'readMessage',
  LOGIN: 'login',
  LOGOUT: 'logout',
  KICK_OUT: 'kickOut',
  RECONNECT: 'reconnect',
  RECONNECT_ERROR: 'reconnect_error',
  RECONNECT_FAILED: 'reconnect_failed',
  RECONNECTING: 'reconnecting',
  RECONNECT_ATTEMPT: 'reconnect_attempt',
  RECONNECT_MANUAL: 'reconnect_manual',
  RECONNECT_ABORT: 'reconnect_abort',
  HEARTBEAT: 'heartbeat',
  CREATE_ROOM: 'createRoom',
}
