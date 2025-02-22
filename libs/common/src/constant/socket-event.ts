/**
 * socket 事件
 */
export enum SOCKET_EVENT {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  CONNECTION = 'connection',
  MESSAGE = 'message',
  ERROR = 'error',
  READY = 'ready',
  JOIN_ROOM = 'joinRoom',
  SEND_MESSAGE = 'sendMessage',
  RECEIVE_MESSAGE = 'receiveMessage',
  LEAVE_ROOM = 'leaveRoom',
  READ_MESSAGE = 'readMessage',
  FRIEND_READ_MESSAGE = 'friendReadMessage',
  LOGIN = 'login',
  LOGOUT = 'logout',
  KICK_OUT = 'kickOut',
  RECONNECT = 'reconnect',
  RECONNECT_ERROR = 'reconnect_error',
  RECONNECT_FAILED = 'reconnect_failed',
  RECONNECTING = 'reconnecting',
  RECONNECT_ATTEMPT = 'reconnect_attempt',
  RECONNECT_MANUAL = 'reconnect_manual',
  RECONNECT_ABORT = 'reconnect_abort',
  HEARTBEAT = 'heartbeat',
  CREATE_ROOM = 'createRoom',
  NOTIFICATION = 'notification',
  /**
   * 收到好友申请
   */
  RECEIVE_FRIEND_ADD_ADMIT = 'receiveFriendAddAdmit',
  /**
   * 处理好友申请
   */
  HANDLE_FRIEND_ADD = 'handleFriendAddAdmit',
  /**
   * 发送好友申请
   */
  SEND_FRIEND_ADD = 'sendFriendAdd',
  /**
   * 收到好友申请拒绝
   */
  RECEIVE_FRIEND_ADD_REFUSE = 'receiveFriendAddRefuse',
  HANDLE_FRIEND_ADD_REFUSE = 'handleFriendAddRefuse',
}
