import { DatabaseService } from '../../database/connection/database.service';
import { Notification, CreateNotificationData, UpdateNotificationData } from '../entities/notification.entity';
export declare class NotificationRepository {
    private readonly databaseService;
    constructor(databaseService: DatabaseService);
    create(notificationData: CreateNotificationData): Promise<Notification>;
    findById(id: string): Promise<Notification | null>;
    findByUserId(userId: string, page?: number, limit?: number): Promise<{
        notifications: Notification[];
        total: number;
    }>;
    findUnreadByUserId(userId: string): Promise<Notification[]>;
    findAll(page?: number, limit?: number, userId?: string): Promise<{
        notifications: Notification[];
        total: number;
    }>;
    update(id: string, updateData: UpdateNotificationData): Promise<Notification | null>;
    markAsRead(id: string): Promise<Notification | null>;
    markAllAsRead(userId: string): Promise<number>;
    delete(id: string): Promise<boolean>;
    deleteByUserId(userId: string): Promise<number>;
    private mapToNotification;
}
