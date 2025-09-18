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
exports.MarkNotificationAsReadHandler = void 0;
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const mark_notification_as_read_command_1 = require("./mark-notification-as-read.command");
const notification_repository_1 = require("../repositories/notification.repository");
let MarkNotificationAsReadHandler = class MarkNotificationAsReadHandler {
    notificationRepository;
    constructor(notificationRepository) {
        this.notificationRepository = notificationRepository;
    }
    async execute(command) {
        const { id } = command;
        await this.notificationRepository.markAsRead(id);
    }
};
exports.MarkNotificationAsReadHandler = MarkNotificationAsReadHandler;
exports.MarkNotificationAsReadHandler = MarkNotificationAsReadHandler = __decorate([
    (0, cqrs_1.CommandHandler)(mark_notification_as_read_command_1.MarkNotificationAsReadCommand),
    __param(0, (0, common_1.Inject)('NotificationRepository')),
    __metadata("design:paramtypes", [notification_repository_1.NotificationRepository])
], MarkNotificationAsReadHandler);
//# sourceMappingURL=mark-notification-as-read.handler.js.map