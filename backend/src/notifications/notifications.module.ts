import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DatabaseModule } from '../database/database.module';
import { NotificationRepository } from './repositories/notification.repository';
import { CreateNotificationHandler } from './commands/create-notification.handler';
import { MarkNotificationAsReadHandler } from './commands/mark-notification-as-read.handler';
import { GetNotificationsHandler, GetNotificationHandler } from './queries/get-notifications.handler';
import { NotificationsController } from './notifications.controller';
import { NotificationService } from './services/notification.service';
import { EmailService } from './services/email.service';
import { WhatsAppService } from './services/whatsapp.service';
import { SmsService } from './services/sms.service';

@Module({
  imports: [CqrsModule, DatabaseModule],
  controllers: [NotificationsController],
  providers: [
    {
      provide: 'NotificationRepository',
      useClass: NotificationRepository,
    },
    NotificationService,
    EmailService,
    WhatsAppService,
    SmsService,
    CreateNotificationHandler,
    MarkNotificationAsReadHandler,
    GetNotificationsHandler,
    GetNotificationHandler,
  ],
  exports: ['NotificationRepository', NotificationService],
})
export class NotificationsModule {}