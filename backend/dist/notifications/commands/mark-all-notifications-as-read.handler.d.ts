import { ICommandHandler } from '@nestjs/cqrs';
import { MarkAllNotificationsAsReadCommand } from './mark-notification-as-read.command';
import { NotificationRepository } from '../repositories/notification.repository';
export declare class MarkAllNotificationsAsReadHandler implements ICommandHandler<MarkAllNotificationsAsReadCommand> {
    private readonly notificationRepository;
    constructor(notificationRepository: NotificationRepository);
    execute(command: MarkAllNotificationsAsReadCommand): Promise<number>;
}
