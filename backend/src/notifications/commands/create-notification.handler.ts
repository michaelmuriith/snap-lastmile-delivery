import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateNotificationCommand } from './create-notification.command';
import { Notification } from '../entities/notification.entity';
import { NotificationRepository } from '../repositories/notification.repository';
import { NotificationService, NotificationChannelType } from '../services/notification.service';

@CommandHandler(CreateNotificationCommand)
export class CreateNotificationHandler implements ICommandHandler<CreateNotificationCommand> {
  constructor(
    @Inject('NotificationRepository')
    private readonly notificationRepository: NotificationRepository,
    private readonly notificationService: NotificationService,
  ) {}

  async execute(command: CreateNotificationCommand): Promise<Notification> {
    const { notificationData } = command;

    // Create the notification in the database
    const notification = await this.notificationRepository.create(notificationData);

    // Send the notification via configured channels (email, WhatsApp, SMS)
    try {
      // Create notification data with default channels (in-app is always included)
      const notificationDataForSending = {
        userId: notificationData.userId,
        title: notificationData.title,
        message: notificationData.message,
        type: notificationData.type,
        channels: [NotificationChannelType.IN_APP], // Default to in-app notifications
        metadata: notificationData.metadata,
      };

      await this.notificationService.sendNotification(notificationDataForSending);
    } catch (error) {
      console.error('Failed to send notification:', error);
      // Don't fail the command if sending fails - notification is still created
    }

    return notification;
  }
}