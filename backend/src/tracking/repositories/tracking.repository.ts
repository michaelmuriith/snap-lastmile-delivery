import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/connection/database.service';
import {
  TrackingData,
  CreateTrackingData,
  UpdateTrackingData,
  TrackingSession
} from '../entities/tracking.entity';

@Injectable()
export class TrackingRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(trackingData: CreateTrackingData): Promise<TrackingData> {
    const query = `
      INSERT INTO tracking (
        delivery_id, driver_id, latitude, longitude, accuracy, speed, heading, status, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id, delivery_id, driver_id, latitude, longitude, accuracy, speed, heading, status, created_at, updated_at
    `;

    const values = [
      trackingData.deliveryId,
      trackingData.driverId,
      trackingData.coordinates.latitude,
      trackingData.coordinates.longitude,
      trackingData.coordinates.accuracy || null,
      trackingData.speed || null,
      trackingData.heading || null,
      'active',
      new Date(),
      new Date(),
    ];

    const result = await this.databaseService.query(query, values);
    return this.mapToTrackingData(result.rows[0]);
  }

  async findById(id: string): Promise<TrackingData | null> {
    const query = `
      SELECT id, delivery_id, driver_id, latitude, longitude, accuracy, speed, heading, status, created_at, updated_at
      FROM tracking
      WHERE id = $1
    `;

    const result = await this.databaseService.query(query, [id]);
    return result.rows.length > 0 ? this.mapToTrackingData(result.rows[0]) : null;
  }

  async findByDeliveryId(deliveryId: string, limit: number = 50): Promise<TrackingData[]> {
    const query = `
      SELECT id, delivery_id, driver_id, latitude, longitude, accuracy, speed, heading, status, created_at, updated_at
      FROM tracking
      WHERE delivery_id = $1
      ORDER BY created_at DESC
      LIMIT $2
    `;

    const result = await this.databaseService.query(query, [deliveryId, limit]);
    return result.rows.map(row => this.mapToTrackingData(row));
  }

  async findByDriverId(driverId: string, limit: number = 50): Promise<TrackingData[]> {
    const query = `
      SELECT id, delivery_id, driver_id, latitude, longitude, accuracy, speed, heading, status, created_at, updated_at
      FROM tracking
      WHERE driver_id = $1
      ORDER BY created_at DESC
      LIMIT $2
    `;

    const result = await this.databaseService.query(query, [driverId, limit]);
    return result.rows.map(row => this.mapToTrackingData(row));
  }

  async findLatestByDeliveryId(deliveryId: string): Promise<TrackingData | null> {
    const query = `
      SELECT id, delivery_id, driver_id, latitude, longitude, accuracy, speed, heading, status, created_at, updated_at
      FROM tracking
      WHERE delivery_id = $1 AND status = 'active'
      ORDER BY created_at DESC
      LIMIT 1
    `;

    const result = await this.databaseService.query(query, [deliveryId]);
    return result.rows.length > 0 ? this.mapToTrackingData(result.rows[0]) : null;
  }

  async update(id: string, updateData: UpdateTrackingData): Promise<TrackingData | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (updateData.coordinates) {
      fields.push(`latitude = $${paramIndex}`, `longitude = $${paramIndex + 1}`);
      values.push(updateData.coordinates.latitude, updateData.coordinates.longitude);
      paramIndex += 2;

      if (updateData.coordinates.accuracy !== undefined) {
        fields.push(`accuracy = $${paramIndex}`);
        values.push(updateData.coordinates.accuracy);
        paramIndex++;
      }
    }

    if (updateData.speed !== undefined) {
      fields.push(`speed = $${paramIndex}`);
      values.push(updateData.speed);
      paramIndex++;
    }

    if (updateData.heading !== undefined) {
      fields.push(`heading = $${paramIndex}`);
      values.push(updateData.heading);
      paramIndex++;
    }

    if (updateData.status !== undefined) {
      fields.push(`status = $${paramIndex}`);
      values.push(updateData.status);
      paramIndex++;
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    fields.push(`updated_at = $${paramIndex}`);
    values.push(new Date());
    paramIndex++;

    const query = `
      UPDATE tracking
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING id, delivery_id, driver_id, latitude, longitude, accuracy, speed, heading, status, created_at, updated_at
    `;

    values.push(id);

    const result = await this.databaseService.query(query, values);
    return result.rows.length > 0 ? this.mapToTrackingData(result.rows[0]) : null;
  }

  async updateStatusByDeliveryId(deliveryId: string, status: string): Promise<number> {
    const query = `
      UPDATE tracking
      SET status = $1, updated_at = $2
      WHERE delivery_id = $3 AND status = 'active'
    `;

    const result = await this.databaseService.query(query, [status, new Date(), deliveryId]);
    return result.rowCount || 0;
  }

  async delete(id: string): Promise<boolean> {
    const query = 'DELETE FROM tracking WHERE id = $1';
    const result = await this.databaseService.query(query, [id]);
    return result.rowCount > 0;
  }

  async deleteByDeliveryId(deliveryId: string): Promise<number> {
    const query = 'DELETE FROM tracking WHERE delivery_id = $1';
    const result = await this.databaseService.query(query, [deliveryId]);
    return result.rowCount || 0;
  }

  // Tracking Sessions
  async createSession(deliveryId: string, driverId: string): Promise<TrackingSession> {
    const query = `
      INSERT INTO tracking_sessions (delivery_id, driver_id, start_time, status, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, delivery_id, driver_id, start_time, end_time, status, total_distance, average_speed, created_at, updated_at
    `;

    const values = [
      deliveryId,
      driverId,
      new Date(),
      'active',
      new Date(),
      new Date(),
    ];

    const result = await this.databaseService.query(query, values);
    return this.mapToTrackingSession(result.rows[0]);
  }

  async findActiveSession(deliveryId: string): Promise<TrackingSession | null> {
    const query = `
      SELECT id, delivery_id, driver_id, start_time, end_time, status, total_distance, average_speed, created_at, updated_at
      FROM tracking_sessions
      WHERE delivery_id = $1 AND status = 'active'
      ORDER BY start_time DESC
      LIMIT 1
    `;

    const result = await this.databaseService.query(query, [deliveryId]);
    return result.rows.length > 0 ? this.mapToTrackingSession(result.rows[0]) : null;
  }

  async endSession(sessionId: string, totalDistance?: number, averageSpeed?: number): Promise<TrackingSession | null> {
    const query = `
      UPDATE tracking_sessions
      SET end_time = $1, status = $2, total_distance = $3, average_speed = $4, updated_at = $5
      WHERE id = $6 AND status = 'active'
      RETURNING id, delivery_id, driver_id, start_time, end_time, status, total_distance, average_speed, created_at, updated_at
    `;

    const values = [
      new Date(),
      'completed',
      totalDistance || null,
      averageSpeed || null,
      new Date(),
      sessionId,
    ];

    const result = await this.databaseService.query(query, values);
    return result.rows.length > 0 ? this.mapToTrackingSession(result.rows[0]) : null;
  }

  private mapToTrackingData(row: any): TrackingData {
    return {
      id: row.id,
      deliveryId: row.delivery_id,
      driverId: row.driver_id,
      coordinates: {
        latitude: parseFloat(row.latitude),
        longitude: parseFloat(row.longitude),
        accuracy: row.accuracy ? parseFloat(row.accuracy) : undefined,
        timestamp: row.created_at,
      },
      speed: row.speed ? parseFloat(row.speed) : undefined,
      heading: row.heading ? parseFloat(row.heading) : undefined,
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  private mapToTrackingSession(row: any): TrackingSession {
    return {
      deliveryId: row.delivery_id,
      driverId: row.driver_id,
      startTime: row.start_time,
      endTime: row.end_time,
      status: row.status,
      totalDistance: row.total_distance ? parseFloat(row.total_distance) : undefined,
      averageSpeed: row.average_speed ? parseFloat(row.average_speed) : undefined,
    };
  }
}