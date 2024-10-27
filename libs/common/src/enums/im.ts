export enum ImUserStatusEnum {
  OFFLINE = 1,
  ONLINE = 0,
}

export enum ImUserTypeEnum {
  USER = 0,
  GROUP = 1,
}

export enum ImMessageStatusEnum {
  UNREAD = 1,
  READ = 0,
}

export enum ImSendMessageTypeEnum {
  TEXT = 1,
  IMAGE = 2,
  VIDEO = 3,
  AUDIO = 4,
  FILE = 5,
  CUSTOM = 6,
  NOTICE = 7,
  SYSTEM = 8,
  RECALL = 9,
  RECALL_NOTICE = 10,
  RECALL_SYSTEM = 11,
  RECALL_CUSTOM = 12,
  RECALL_IMAGE = 13,
  RECALL_VIDEO = 14,
}

export const ImMessageTypeMap = {
  [ImSendMessageTypeEnum.TEXT]: 'text',
  [ImSendMessageTypeEnum.IMAGE]: 'image',
  [ImSendMessageTypeEnum.VIDEO]: 'video',
  [ImSendMessageTypeEnum.AUDIO]: 'audio',
  [ImSendMessageTypeEnum.FILE]: 'file',
  [ImSendMessageTypeEnum.CUSTOM]: 'custom',
  [ImSendMessageTypeEnum.NOTICE]: 'notice',
}

export const ImMessageTypeList = Object.keys(ImMessageTypeMap)
