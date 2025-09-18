import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Notification } from './entities/notification.entity';
export declare class NotificationsController {
    private readonly commandBus;
    private readonly queryBus;
    constructor(commandBus: CommandBus, queryBus: QueryBus);
    getNotifications(page?: string, limit?: string, isRead?: string): Promise<{
        notifications: Notification[];
        total: number;
    }>;
    getNotification(id: string): Promise<Notification | null>;
    markAsRead(id: string): Promise<void>;
    markAllAsRead(): Promise<number>;
}
