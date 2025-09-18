import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { MarkNotificationAsReadCommand } from './mark-notification-as-read.command';
import { NotificationRepository } from '../repositories/notification.repository';

@CommandHandler(MarkNotificationAsReadCommand)
export class MarkNotificationAsReadHandler implements ICommandHandler<MarkNotificationAsReadCommand> {
  constructor(
    @Inject('NotificationRepository')
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async execute(command: MarkNotificationAsReadCommand): Promise<void> {
    const { id } = command;
    await this.notificationRepository.markAsRead(id);
  }
}