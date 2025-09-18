export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  metadata?: Record<string, any>;
  createdAt: Date;
}

export type NotificationType =
  | 'delivery_created'
  | 'delivery_assigned'
  | 'delivery_picked_up'
  | 'delivery_in_transit'
  | 'delivery_delivered'
  | 'delivery_cancelled'
  | 'payment_completed'
  | 'payment_failed'
  | 'system_notification'
  | 'driver_assigned'
  | 'location_update';

export interface CreateNotificationData {
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  metadata?: Record<string, any>;
}

export interface UpdateNotificationData {
  isRead?: boolean;
}