import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { MarkAllNotificationsAsReadCommand } from './mark-notification-as-read.command';
import { NotificationRepository } from '../repositories/notification.repository';

@CommandHandler(MarkAllNotificationsAsReadCommand)
export class MarkAllNotificationsAsReadHandler implements ICommandHandler<MarkAllNotificationsAsReadCommand> {
  constructor(
    @Inject('NotificationRepository')
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async execute(command: MarkAllNotificationsAsReadCommand): Promise<number> {
    const { userId } = command;
    return this.notificationRepository.markAllAsRead(userId);
  }
}