import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetNotificationsQuery, GetNotificationQuery } from './get-notifications.query';
import { NotificationRepository } from '../repositories/notification.repository';
import { Notification } from '../entities/notification.entity';

@QueryHandler(GetNotificationsQuery)
export class GetNotificationsHandler implements IQueryHandler<GetNotificationsQuery> {
  constructor(
    @Inject('NotificationRepository')
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async execute(query: GetNotificationsQuery): Promise<{ notifications: Notification[]; total: number }> {
    const { userId, page, limit, isRead } = query;

    if (isRead !== undefined) {
      // If filtering by read status, we need to use a different approach
      const allNotifications = await this.notificationRepository.findByUserId(userId, 1, 1000); // Get all first
      const filtered = allNotifications.notifications.filter(n => n.isRead === isRead);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;

      return {
        notifications: filtered.slice(startIndex, endIndex),
        total: filtered.length,
      };
    }

    return this.notificationRepository.findByUserId(userId, page, limit);
  }
}

@QueryHandler(GetNotificationQuery)
export class GetNotificationHandler implements IQueryHandler<GetNotificationQuery> {
  constructor(
    @Inject('NotificationRepository')
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async execute(query: GetNotificationQuery): Promise<Notification | null> {
    const { id } = query;
    return this.notificationRepository.findById(id);
  }
}