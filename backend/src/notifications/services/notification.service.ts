import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailService } from './email.service';
import { WhatsAppService } from './whatsapp.service';
import { SmsService } from './sms.service';

export interface NotificationChannel {
  send(to: string, subject: string, message: string, metadata?: any): Promise<boolean>;
}

export interface NotificationData {
  userId: string;
  title: string;
  message: string;
  type: string;
  channels: NotificationChannelType[];
  metadata?: any;
}

export enum NotificationChannelType {
  EMAIL = 'email',
  WHATSAPP = 'whatsapp',
  SMS = 'sms',
  IN_APP = 'in_app',
}

@Injectable()
export class NotificationService {
  constructor(
    private readonly configService: ConfigService,
    @Inject(EmailService) private readonly emailService: EmailService,
    @Inject(WhatsAppService) private readonly whatsAppService: WhatsAppService,
    @Inject(SmsService) private readonly smsService: SmsService,
  ) {}

  async sendNotification(notificationData: NotificationData): Promise<void> {
    const { userId, title, message, type, channels, metadata } = notificationData;

    // Send to each requested channel
    for (const channel of channels) {
      try {
        switch (channel) {
          case NotificationChannelType.EMAIL:
            await this.sendEmail(userId, title, message, metadata);
            break;
          case NotificationChannelType.WHATSAPP:
            await this.sendWhatsApp(userId, message, metadata);
            break;
          case NotificationChannelType.SMS:
            await this.sendSMS(userId, message, metadata);
            break;
          case NotificationChannelType.IN_APP:
            // In-app notifications are handled by the existing system
            break;
        }
      } catch (error) {
        console.error(`Failed to send ${channel} notification:`, error);
        // Continue with other channels even if one fails
      }
    }
  }

  private async sendEmail(userId: string, subject: string, message: string, metadata?: any): Promise<void> {
    const email = await this.getUserEmail(userId);
    await this.emailService.send(email, subject, message, metadata);
  }

  private async sendWhatsApp(userId: string, message: string, metadata?: any): Promise<void> {
    const phone = await this.getUserPhone(userId);
    await this.whatsAppService.send(phone, 'WhatsApp Message', message, metadata);
  }

  private async sendSMS(userId: string, message: string, metadata?: any): Promise<void> {
    const phone = await this.getUserPhone(userId);
    await this.smsService.send(phone, 'SMS Message', message, metadata);
  }

  private async getUserEmail(userId: string): Promise<string> {
    // TODO: Get user email from database
    // This would typically query the users table
    return `user${userId}@example.com`;
  }

  private async getUserPhone(userId: string): Promise<string> {
    // TODO: Get user phone from database
    // This would typically query the users table
    return `+1234567890`;
  }
}