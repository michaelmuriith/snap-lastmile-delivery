"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarkAllNotificationsAsReadCommand = exports.MarkNotificationAsReadCommand = exports.CreateNotificationCommand = void 0;
class CreateNotificationCommand {
    notificationData;
    constructor(notificationData) {
        this.notificationData = notificationData;
    }
}
exports.CreateNotificationCommand = CreateNotificationCommand;
class MarkNotificationAsReadCommand {
    id;
    constructor(id) {
        this.id = id;
    }
}
exports.MarkNotificationAsReadCommand = MarkNotificationAsReadCommand;
class MarkAllNotificationsAsReadCommand {
    userId;
    constructor(userId) {
        this.userId = userId;
    }
}
exports.MarkAllNotificationsAsReadCommand = MarkAllNotificationsAsReadCommand;
//# sourceMappingURL=create-notification.command.js.map