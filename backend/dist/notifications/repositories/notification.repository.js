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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRepository = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../../database/connection/database.service");
let NotificationRepository = class NotificationRepository {
    databaseService;
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    async create(notificationData) {
        const query = `
      INSERT INTO notifications (
        user_id, title, message, type, metadata, created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, user_id, title, message, type, is_read, metadata, created_at
    `;
        const values = [
            notificationData.userId,
            notificationData.title,
            notificationData.message,
            notificationData.type,
            notificationData.metadata ? JSON.stringify(notificationData.metadata) : null,
            new Date(),
        ];
        const result = await this.databaseService.query(query, values);
        return this.mapToNotification(result.rows[0]);
    }
    async findById(id) {
        const query = `
      SELECT id, user_id, title, message, type, is_read, metadata, created_at
      FROM notifications
      WHERE id = $1
    `;
        const result = await this.databaseService.query(query, [id]);
        return result.rows.length > 0 ? this.mapToNotification(result.rows[0]) : null;
    }
    async findByUserId(userId, page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const countQuery = `
      SELECT COUNT(*) as total
      FROM notifications
      WHERE user_id = $1
    `;
        const dataQuery = `
      SELECT id, user_id, title, message, type, is_read, metadata, created_at
      FROM notifications
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `;
        const [countResult, dataResult] = await Promise.all([
            this.databaseService.query(countQuery, [userId]),
            this.databaseService.query(dataQuery, [userId, limit, offset]),
        ]);
        return {
            notifications: dataResult.rows.map(row => this.mapToNotification(row)),
            total: parseInt(countResult.rows[0].total, 10),
        };
    }
    async findUnreadByUserId(userId) {
        const query = `
      SELECT id, user_id, title, message, type, is_read, metadata, created_at
      FROM notifications
      WHERE user_id = $1 AND is_read = false
      ORDER BY created_at DESC
    `;
        const result = await this.databaseService.query(query, [userId]);
        return result.rows.map(row => this.mapToNotification(row));
    }
    async findAll(page = 1, limit = 10, userId) {
        const offset = (page - 1) * limit;
        let countQuery = 'SELECT COUNT(*) as total FROM notifications';
        let dataQuery = `
      SELECT id, user_id, title, message, type, is_read, metadata, created_at
      FROM notifications
    `;
        const params = [];
        let paramIndex = 1;
        if (userId) {
            countQuery += ' WHERE user_id = $1';
            dataQuery += ' WHERE user_id = $' + paramIndex;
            params.push(userId);
            paramIndex++;
        }
        dataQuery += ' ORDER BY created_at DESC LIMIT $' + paramIndex + ' OFFSET $' + (paramIndex + 1);
        params.push(limit, offset);
        const [countResult, dataResult] = await Promise.all([
            this.databaseService.query(countQuery, userId ? [userId] : []),
            this.databaseService.query(dataQuery, params),
        ]);
        return {
            notifications: dataResult.rows.map(row => this.mapToNotification(row)),
            total: parseInt(countResult.rows[0].total, 10),
        };
    }
    async update(id, updateData) {
        const fields = [];
        const values = [];
        let paramIndex = 1;
        if (updateData.isRead !== undefined) {
            fields.push(`is_read = $${paramIndex}`);
            values.push(updateData.isRead);
            paramIndex++;
        }
        if (fields.length === 0) {
            return this.findById(id);
        }
        const query = `
      UPDATE notifications
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING id, user_id, title, message, type, is_read, metadata, created_at
    `;
        values.push(id);
        const result = await this.databaseService.query(query, values);
        return result.rows.length > 0 ? this.mapToNotification(result.rows[0]) : null;
    }
    async markAsRead(id) {
        return this.update(id, { isRead: true });
    }
    async markAllAsRead(userId) {
        const query = `
      UPDATE notifications
      SET is_read = true
      WHERE user_id = $1 AND is_read = false
    `;
        const result = await this.databaseService.query(query, [userId]);
        return result.rowCount || 0;
    }
    async delete(id) {
        const query = 'DELETE FROM notifications WHERE id = $1';
        const result = await this.databaseService.query(query, [id]);
        return result.rowCount > 0;
    }
    async deleteByUserId(userId) {
        const query = 'DELETE FROM notifications WHERE user_id = $1';
        const result = await this.databaseService.query(query, [userId]);
        return result.rowCount || 0;
    }
    mapToNotification(row) {
        return {
            id: row.id,
            userId: row.user_id,
            title: row.title,
            message: row.message,
            type: row.type,
            isRead: row.is_read,
            metadata: row.metadata,
            createdAt: row.created_at,
        };
    }
};
exports.NotificationRepository = NotificationRepository;
exports.NotificationRepository = NotificationRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], NotificationRepository);
//# sourceMappingURL=notification.repository.js.map