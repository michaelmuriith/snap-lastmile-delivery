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
export declare enum NotificationChannelType {
    EMAIL = "email",
    WHATSAPP = "whatsapp",
    SMS = "sms",
    IN_APP = "in_app"
}
export declare class NotificationService {
    private readonly configService;
    private readonly emailService;
    private readonly whatsAppService;
    private readonly smsService;
    constructor(configService: ConfigService, emailService: EmailService, whatsAppService: WhatsAppService, smsService: SmsService);
    sendNotification(notificationData: NotificationData): Promise<void>;
    private sendEmail;
    private sendWhatsApp;
    private sendSMS;
    private getUserEmail;
    private getUserPhone;
}
