import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/connection/database.service';
import { Notification, CreateNotificationData, UpdateNotificationData } from '../entities/notification.entity';

@Injectable()
export class NotificationRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(notificationData: CreateNotificationData): Promise<Notification> {
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

  async findById(id: string): Promise<Notification | null> {
    const query = `
      SELECT id, user_id, title, message, type, is_read, metadata, created_at
      FROM notifications
      WHERE id = $1
    `;

    const result = await this.databaseService.query(query, [id]);
    return result.rows.length > 0 ? this.mapToNotification(result.rows[0]) : null;
  }

  async findByUserId(userId: string, page: number = 1, limit: number = 10): Promise<{ notifications: Notification[]; total: number }> {
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

  async findUnreadByUserId(userId: string): Promise<Notification[]> {
    const query = `
      SELECT id, user_id, title, message, type, is_read, metadata, created_at
      FROM notifications
      WHERE user_id = $1 AND is_read = false
      ORDER BY created_at DESC
    `;

    const result = await this.databaseService.query(query, [userId]);
    return result.rows.map(row => this.mapToNotification(row));
  }

  async findAll(page: number = 1, limit: number = 10, userId?: string): Promise<{ notifications: Notification[]; total: number }> {
    const offset = (page - 1) * limit;

    let countQuery = 'SELECT COUNT(*) as total FROM notifications';
    let dataQuery = `
      SELECT id, user_id, title, message, type, is_read, metadata, created_at
      FROM notifications
    `;

    const params: any[] = [];
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

  async update(id: string, updateData: UpdateNotificationData): Promise<Notification | null> {
    const fields: string[] = [];
    const values: any[] = [];
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

  async markAsRead(id: string): Promise<Notification | null> {
    return this.update(id, { isRead: true });
  }

  async markAllAsRead(userId: string): Promise<number> {
    const query = `
      UPDATE notifications
      SET is_read = true
      WHERE user_id = $1 AND is_read = false
    `;

    const result = await this.databaseService.query(query, [userId]);
    return result.rowCount || 0;
  }

  async delete(id: string): Promise<boolean> {
    const query = 'DELETE FROM notifications WHERE id = $1';
    const result = await this.databaseService.query(query, [id]);
    return result.rowCount > 0;
  }

  async deleteByUserId(userId: string): Promise<number> {
    const query = 'DELETE FROM notifications WHERE user_id = $1';
    const result = await this.databaseService.query(query, [userId]);
    return result.rowCount || 0;
  }

  private mapToNotification(row: any): Notification {
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
}