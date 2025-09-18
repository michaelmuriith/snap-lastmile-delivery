import { IQueryHandler } from '@nestjs/cqrs';
import { GetNotificationsQuery, GetNotificationQuery } from './get-notifications.query';
import { NotificationRepository } from '../repositories/notification.repository';
import { Notification } from '../entities/notification.entity';
export declare class GetNotificationsHandler implements IQueryHandler<GetNotificationsQuery> {
    private readonly notificationRepository;
    constructor(notificationRepository: NotificationRepository);
    execute(query: GetNotificationsQuery): Promise<{
        notifications: Notification[];
        total: number;
    }>;
}
export declare class GetNotificationHandler implements IQueryHandler<GetNotificationQuery> {
    private readonly notificationRepository;
    constructor(notificationRepository: NotificationRepository);
    execute(query: GetNotificationQuery): Promise<Notification | null>;
}
