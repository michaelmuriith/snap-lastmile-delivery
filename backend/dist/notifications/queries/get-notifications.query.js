"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetNotificationQuery = exports.GetNotificationsQuery = void 0;
class GetNotificationsQuery {
    userId;
    page;
    limit;
    isRead;
    constructor(userId, page = 1, limit = 10, isRead) {
        this.userId = userId;
        this.page = page;
        this.limit = limit;
        this.isRead = isRead;
    }
}
exports.GetNotificationsQuery = GetNotificationsQuery;
class GetNotificationQuery {
    id;
    constructor(id) {
        this.id = id;
    }
}
exports.GetNotificationQuery = GetNotificationQuery;
//# sourceMappingURL=get-notifications.query.js.map