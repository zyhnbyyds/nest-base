export interface Notification {
  notificationId: string
  message: string
  type: string
  toUserId: string
  fromUserId: string
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
  isRead: boolean
  isDeleted: boolean
}
