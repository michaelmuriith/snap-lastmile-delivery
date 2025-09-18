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
exports.GetNotificationHandler = exports.GetNotificationsHandler = void 0;
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const get_notifications_query_1 = require("./get-notifications.query");
const notification_repository_1 = require("../repositories/notification.repository");
let GetNotificationsHandler = class GetNotificationsHandler {
    notificationRepository;
    constructor(notificationRepository) {
        this.notificationRepository = notificationRepository;
    }
    async execute(query) {
        const { userId, page, limit, isRead } = query;
        if (isRead !== undefined) {
            const allNotifications = await this.notificationRepository.findByUserId(userId, 1, 1000);
            const filtered = allNotifications.notifications.filter(n => n.isRead === isRead);
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;
            return {
                notifications: filtered.slice(startIndex, endIndex),
                total: filtered.length,
            };
        }
        return this.notificationRepository.findByUserId(userId, page, limit);
    }
};
exports.GetNotificationsHandler = GetNotificationsHandler;
exports.GetNotificationsHandler = GetNotificationsHandler = __decorate([
    (0, cqrs_1.QueryHandler)(get_notifications_query_1.GetNotificationsQuery),
    __param(0, (0, common_1.Inject)('NotificationRepository')),
    __metadata("design:paramtypes", [notification_repository_1.NotificationRepository])
], GetNotificationsHandler);
let GetNotificationHandler = class GetNotificationHandler {
    notificationRepository;
    constructor(notificationRepository) {
        this.notificationRepository = notificationRepository;
    }
    async execute(query) {
        const { id } = query;
        return this.notificationRepository.findById(id);
    }
};
exports.GetNotificationHandler = GetNotificationHandler;
exports.GetNotificationHandler = GetNotificationHandler = __decorate([
    (0, cqrs_1.QueryHandler)(get_notifications_query_1.GetNotificationQuery),
    __param(0, (0, common_1.Inject)('NotificationRepository')),
    __metadata("design:paramtypes", [notification_repository_1.NotificationRepository])
], GetNotificationHandler);
//# sourceMappingURL=get-notifications.handler.js.map