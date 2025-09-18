import { ICommandHandler } from '@nestjs/cqrs';
import { CreateNotificationCommand } from './create-notification.command';
import { Notification } from '../entities/notification.entity';
import { NotificationRepository } from '../repositories/notification.repository';
import { NotificationService } from '../services/notification.service';
export declare class CreateNotificationHandler implements ICommandHandler<CreateNotificationCommand> {
    private readonly notificationRepository;
    private readonly notificationService;
    constructor(notificationRepository: NotificationRepository, notificationService: NotificationService);
    execute(command: CreateNotificationCommand): Promise<Notification>;
}
