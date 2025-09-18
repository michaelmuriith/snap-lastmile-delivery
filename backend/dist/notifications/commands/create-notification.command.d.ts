import { CreateNotificationData } from '../entities/notification.entity';
export declare class CreateNotificationCommand {
    readonly notificationData: CreateNotificationData;
    constructor(notificationData: CreateNotificationData);
}
export declare class MarkNotificationAsReadCommand {
    readonly id: string;
    constructor(id: string);
}
export declare class MarkAllNotificationsAsReadCommand {
    readonly userId: string;
    constructor(userId: string);
}
