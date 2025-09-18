"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = exports.NotificationChannelType = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const email_service_1 = require("./email.service");
const whatsapp_service_1 = require("./whatsapp.service");
const sms_service_1 = require("./sms.service");
var NotificationChannelType;
(function (NotificationChannelType) {
    NotificationChannelType["EMAIL"] = "email";
    NotificationChannelType["WHATSAPP"] = "whatsapp";
    NotificationChannelType["SMS"] = "sms";
    NotificationChannelType["IN_APP"] = "in_app";
})(NotificationChannelType || (exports.NotificationChannelType = NotificationChannelType = {}));
let NotificationService = class NotificationService {
    configService;
    emailService;
    whatsAppService;
    smsService;
    constructor(configService, emailService, whatsAppService, smsService) {
        this.configService = configService;
        this.emailService = emailService;
        this.whatsAppService = whatsAppService;
        this.smsService = smsService;
    }
    async sendNotification(notificationData) {
        const { userId, title, message, type, channels, metadata } = notificationData;
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
                        break;
                }
            }
            catch (error) {
                console.error(`Failed to send ${channel} notification:`, error);
            }
        }
    }
    async sendEmail(userId, subject, message, metadata) {
        const email = await this.getUserEmail(userId);
        await this.emailService.send(email, subject, message, metadata);
    }
    async sendWhatsApp(userId, message, metadata) {
        const phone = await this.getUserPhone(userId);
        await this.whatsAppService.send(phone, 'WhatsApp Message', message, metadata);
    }
    async sendSMS(userId, message, metadata) {
        const phone = await this.getUserPhone(userId);
        await this.smsService.send(phone, 'SMS Message', message, metadata);
    }
    async getUserEmail(userId) {
        return `user${userId}@example.com`;
    }
    async getUserPhone(userId) {
        return `+1234567890`;
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(email_service_1.EmailService)),
    __param(2, (0, common_1.Inject)(whatsapp_service_1.WhatsAppService)),
    __param(3, (0, common_1.Inject)(sms_service_1.SmsService)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        email_service_1.EmailService,
        whatsapp_service_1.WhatsAppService,
        sms_service_1.SmsService])
], NotificationService);
//# sourceMappingURL=notification.service.js.map