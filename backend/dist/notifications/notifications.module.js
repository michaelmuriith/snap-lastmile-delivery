"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsModule = void 0;
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const database_module_1 = require("../database/database.module");
const notification_repository_1 = require("./repositories/notification.repository");
const create_notification_handler_1 = require("./commands/create-notification.handler");
const mark_notification_as_read_handler_1 = require("./commands/mark-notification-as-read.handler");
const get_notifications_handler_1 = require("./queries/get-notifications.handler");
const notifications_controller_1 = require("./notifications.controller");
const notification_service_1 = require("./services/notification.service");
const email_service_1 = require("./services/email.service");
const whatsapp_service_1 = require("./services/whatsapp.service");
const sms_service_1 = require("./services/sms.service");
let NotificationsModule = class NotificationsModule {
};
exports.NotificationsModule = NotificationsModule;
exports.NotificationsModule = NotificationsModule = __decorate([
    (0, common_1.Module)({
        imports: [cqrs_1.CqrsModule, database_module_1.DatabaseModule],
        controllers: [notifications_controller_1.NotificationsController],
        providers: [
            {
                provide: 'NotificationRepository',
                useClass: notification_repository_1.NotificationRepository,
            },
            notification_service_1.NotificationService,
            email_service_1.EmailService,
            whatsapp_service_1.WhatsAppService,
            sms_service_1.SmsService,
            create_notification_handler_1.CreateNotificationHandler,
            mark_notification_as_read_handler_1.MarkNotificationAsReadHandler,
            get_notifications_handler_1.GetNotificationsHandler,
            get_notifications_handler_1.GetNotificationHandler,
        ],
        exports: ['NotificationRepository', notification_service_1.NotificationService],
    })
], NotificationsModule);
//# sourceMappingURL=notifications.module.js.map