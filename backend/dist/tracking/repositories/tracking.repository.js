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
exports.TrackingRepository = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../../database/connection/database.service");
let TrackingRepository = class TrackingRepository {
    databaseService;
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    async create(trackingData) {
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
    async findById(id) {
        const query = `
      SELECT id, delivery_id, driver_id, latitude, longitude, accuracy, speed, heading, status, created_at, updated_at
      FROM tracking
      WHERE id = $1
    `;
        const result = await this.databaseService.query(query, [id]);
        return result.rows.length > 0 ? this.mapToTrackingData(result.rows[0]) : null;
    }
    async findByDeliveryId(deliveryId, limit = 50) {
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
    async findByDriverId(driverId, limit = 50) {
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
    async findLatestByDeliveryId(deliveryId) {
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
    async update(id, updateData) {
        const fields = [];
        const values = [];
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
    async updateStatusByDeliveryId(deliveryId, status) {
        const query = `
      UPDATE tracking
      SET status = $1, updated_at = $2
      WHERE delivery_id = $3 AND status = 'active'
    `;
        const result = await this.databaseService.query(query, [status, new Date(), deliveryId]);
        return result.rowCount || 0;
    }
    async delete(id) {
        const query = 'DELETE FROM tracking WHERE id = $1';
        const result = await this.databaseService.query(query, [id]);
        return result.rowCount > 0;
    }
    async deleteByDeliveryId(deliveryId) {
        const query = 'DELETE FROM tracking WHERE delivery_id = $1';
        const result = await this.databaseService.query(query, [deliveryId]);
        return result.rowCount || 0;
    }
    async createSession(deliveryId, driverId) {
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
    async findActiveSession(deliveryId) {
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
    async endSession(sessionId, totalDistance, averageSpeed) {
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
    mapToTrackingData(row) {
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
    mapToTrackingSession(row) {
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
};
exports.TrackingRepository = TrackingRepository;
exports.TrackingRepository = TrackingRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], TrackingRepository);
//# sourceMappingURL=tracking.repository.js.map