import { ConfigService } from '@nestjs/config';
import { NotificationChannel } from './notification.service';
export declare class SmsService implements NotificationChannel {
    private readonly configService;
    constructor(configService: ConfigService);
    send(to: string, subject: string, message: string, metadata?: any): Promise<boolean>;
}
