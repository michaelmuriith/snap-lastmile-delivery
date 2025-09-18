import { ConfigService } from '@nestjs/config';
import { NotificationChannel } from './notification.service';
export declare class EmailService implements NotificationChannel {
    private readonly configService;
    constructor(configService: ConfigService);
    send(to: string, subject: string, message: string, metadata?: any): Promise<boolean>;
}
