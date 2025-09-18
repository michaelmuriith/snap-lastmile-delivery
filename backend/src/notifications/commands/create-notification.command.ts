import { CreateNotificationData } from '../entities/notification.entity';

export class CreateNotificationCommand {
  constructor(public readonly notificationData: CreateNotificationData) {}
}

export class MarkNotificationAsReadCommand {
  constructor(public readonly id: string) {}
}

export class MarkAllNotificationsAsReadCommand {
  constructor(public readonly userId: string) {}
}