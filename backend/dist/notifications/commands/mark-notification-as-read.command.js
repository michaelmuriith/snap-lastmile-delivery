"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarkAllNotificationsAsReadCommand = exports.MarkNotificationAsReadCommand = void 0;
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
//# sourceMappingURL=mark-notification-as-read.command.js.map