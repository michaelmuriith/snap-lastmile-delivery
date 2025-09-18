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
exports.CreateNotificationHandler = void 0;
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const create_notification_command_1 = require("./create-notification.command");
const notification_repository_1 = require("../repositories/notification.repository");
const notification_service_1 = require("../services/notification.service");
let CreateNotificationHandler = class CreateNotificationHandler {
    notificationRepository;
    notificationService;
    constructor(notificationRepository, notificationService) {
        this.notificationRepository = notificationRepository;
        this.notificationService = notificationService;
    }
    async execute(command) {
        const { notificationData } = command;
        const notification = await this.notificationRepository.create(notificationData);
        try {
            const notificationDataForSending = {
                userId: notificationData.userId,
                title: notificationData.title,
                message: notificationData.message,
                type: notificationData.type,
                channels: [notification_service_1.NotificationChannelType.IN_APP],
                metadata: notificationData.metadata,
            };
            await this.notificationService.sendNotification(notificationDataForSending);
        }
        catch (error) {
            console.error('Failed to send notification:', error);
        }
        return notification;
    }
};
exports.CreateNotificationHandler = CreateNotificationHandler;
exports.CreateNotificationHandler = CreateNotificationHandler = __decorate([
    (0, cqrs_1.CommandHandler)(create_notification_command_1.CreateNotificationCommand),
    __param(0, (0, common_1.Inject)('NotificationRepository')),
    __metadata("design:paramtypes", [notification_repository_1.NotificationRepository,
        notification_service_1.NotificationService])
], CreateNotificationHandler);
//# sourceMappingURL=create-notification.handler.js.map