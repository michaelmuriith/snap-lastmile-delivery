import { ICommandHandler } from '@nestjs/cqrs';
import { MarkNotificationAsReadCommand } from './mark-notification-as-read.command';
import { NotificationRepository } from '../repositories/notification.repository';
export declare class MarkNotificationAsReadHandler implements ICommandHandler<MarkNotificationAsReadCommand> {
    private readonly notificationRepository;
    constructor(notificationRepository: NotificationRepository);
    execute(command: MarkNotificationAsReadCommand): Promise<void>;
}
