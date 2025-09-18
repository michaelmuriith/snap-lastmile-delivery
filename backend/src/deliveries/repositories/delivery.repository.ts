import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/connection/database.service';
import { Delivery, CreateDeliveryData, UpdateDeliveryData } from '../entities/delivery.entity';

@Injectable()
export class DeliveryRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(deliveryData: CreateDeliveryData): Promise<Delivery> {
    const query = `
      INSERT INTO deliveries (
        customer_id, type, pickup_address, pickup_latitude, pickup_longitude,
        delivery_address, delivery_latitude, delivery_longitude,
        package_description, package_value, recipient_name, recipient_phone,
        status, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING id, customer_id, driver_id, type, pickup_address, pickup_latitude,
                pickup_longitude, delivery_address, delivery_latitude, delivery_longitude,
                package_description, package_value, recipient_name, recipient_phone,
                status, estimated_delivery_time, actual_delivery_time, created_at, updated_at
    `;

    const values = [
      deliveryData.customerId,
      deliveryData.type,
      deliveryData.pickupAddress,
      deliveryData.pickupLatitude || null,
      deliveryData.pickupLongitude || null,
      deliveryData.deliveryAddress,
      deliveryData.deliveryLatitude || null,
      deliveryData.deliveryLongitude || null,
      deliveryData.packageDescription,
      deliveryData.packageValue || null,
      deliveryData.recipientName || null,
      deliveryData.recipientPhone || null,
      'pending',
      new Date(),
      new Date(),
    ];

    const result = await this.databaseService.query(query, values);
    return this.mapToDelivery(result.rows[0]);
  }

  async findById(id: string): Promise<Delivery | null> {
    const query = `
      SELECT id, customer_id, driver_id, type, pickup_address, pickup_latitude,
             pickup_longitude, delivery_address, delivery_latitude, delivery_longitude,
             package_description, package_value, recipient_name, recipient_phone,
             status, estimated_delivery_time, actual_delivery_time, created_at, updated_at
      FROM deliveries
      WHERE id = $1
    `;

    const result = await this.databaseService.query(query, [id]);
    return result.rows.length > 0 ? this.mapToDelivery(result.rows[0]) : null;
  }

  async findByCustomerId(customerId: string, page: number = 1, limit: number = 10): Promise<{ deliveries: Delivery[]; total: number }> {
    const offset = (page - 1) * limit;

    const countQuery = `
      SELECT COUNT(*) as total
      FROM deliveries
      WHERE customer_id = $1
    `;

    const dataQuery = `
      SELECT id, customer_id, driver_id, type, pickup_address, pickup_latitude,
             pickup_longitude, delivery_address, delivery_latitude, delivery_longitude,
             package_description, package_value, recipient_name, recipient_phone,
             status, estimated_delivery_time, actual_delivery_time, created_at, updated_at
      FROM deliveries
      WHERE customer_id = $1
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `;

    const [countResult, dataResult] = await Promise.all([
      this.databaseService.query(countQuery, [customerId]),
      this.databaseService.query(dataQuery, [customerId, limit, offset]),
    ]);

    return {
      deliveries: dataResult.rows.map(row => this.mapToDelivery(row)),
      total: parseInt(countResult.rows[0].total, 10),
    };
  }

  async findByDriverId(driverId: string, page: number = 1, limit: number = 10): Promise<{ deliveries: Delivery[]; total: number }> {
    const offset = (page - 1) * limit;

    const countQuery = `
      SELECT COUNT(*) as total
      FROM deliveries
      WHERE driver_id = $1
    `;

    const dataQuery = `
      SELECT id, customer_id, driver_id, type, pickup_address, pickup_latitude,
             pickup_longitude, delivery_address, delivery_latitude, delivery_longitude,
             package_description, package_value, recipient_name, recipient_phone,
             status, estimated_delivery_time, actual_delivery_time, created_at, updated_at
      FROM deliveries
      WHERE driver_id = $1
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `;

    const [countResult, dataResult] = await Promise.all([
      this.databaseService.query(countQuery, [driverId]),
      this.databaseService.query(dataQuery, [driverId, limit, offset]),
    ]);

    return {
      deliveries: dataResult.rows.map(row => this.mapToDelivery(row)),
      total: parseInt(countResult.rows[0].total, 10),
    };
  }

  async findAll(page: number = 1, limit: number = 10, status?: string): Promise<{ deliveries: Delivery[]; total: number }> {
    const offset = (page - 1) * limit;

    let countQuery = 'SELECT COUNT(*) as total FROM deliveries';
    let dataQuery = `
      SELECT id, customer_id, driver_id, type, pickup_address, pickup_latitude,
             pickup_longitude, delivery_address, delivery_latitude, delivery_longitude,
             package_description, package_value, recipient_name, recipient_phone,
             status, estimated_delivery_time, actual_delivery_time, created_at, updated_at
      FROM deliveries
    `;

    const params: any[] = [];
    let paramIndex = 1;

    if (status) {
      countQuery += ' WHERE status = $1';
      dataQuery += ' WHERE status = $' + paramIndex;
      params.push(status);
      paramIndex++;
    }

    dataQuery += ' ORDER BY created_at DESC LIMIT $' + paramIndex + ' OFFSET $' + (paramIndex + 1);
    params.push(limit, offset);

    const [countResult, dataResult] = await Promise.all([
      this.databaseService.query(countQuery, status ? [status] : []),
      this.databaseService.query(dataQuery, params),
    ]);

    return {
      deliveries: dataResult.rows.map(row => this.mapToDelivery(row)),
      total: parseInt(countResult.rows[0].total, 10),
    };
  }

  async update(id: string, updateData: UpdateDeliveryData): Promise<Delivery | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (updateData.driverId !== undefined) {
      fields.push(`driver_id = $${paramIndex}`);
      values.push(updateData.driverId);
      paramIndex++;
    }

    if (updateData.status !== undefined) {
      fields.push(`status = $${paramIndex}`);
      values.push(updateData.status);
      paramIndex++;
    }

    if (updateData.estimatedDeliveryTime !== undefined) {
      fields.push(`estimated_delivery_time = $${paramIndex}`);
      values.push(updateData.estimatedDeliveryTime);
      paramIndex++;
    }

    if (updateData.actualDeliveryTime !== undefined) {
      fields.push(`actual_delivery_time = $${paramIndex}`);
      values.push(updateData.actualDeliveryTime);
      paramIndex++;
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    fields.push(`updated_at = $${paramIndex}`);
    values.push(new Date());
    paramIndex++;

    const query = `
      UPDATE deliveries
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING id, customer_id, driver_id, type, pickup_address, pickup_latitude,
                pickup_longitude, delivery_address, delivery_latitude, delivery_longitude,
                package_description, package_value, recipient_name, recipient_phone,
                status, estimated_delivery_time, actual_delivery_time, created_at, updated_at
    `;

    values.push(id);

    const result = await this.databaseService.query(query, values);
    return result.rows.length > 0 ? this.mapToDelivery(result.rows[0]) : null;
  }

  async delete(id: string): Promise<boolean> {
    const query = 'DELETE FROM deliveries WHERE id = $1';
    const result = await this.databaseService.query(query, [id]);
    return result.rowCount > 0;
  }

  private mapToDelivery(row: any): Delivery {
    return {
      id: row.id,
      customerId: row.customer_id,
      driverId: row.driver_id,
      type: row.type,
      pickupAddress: row.pickup_address,
      pickupLatitude: row.pickup_latitude,
      pickupLongitude: row.pickup_longitude,
      deliveryAddress: row.delivery_address,
      deliveryLatitude: row.delivery_latitude,
      deliveryLongitude: row.delivery_longitude,
      packageDescription: row.package_description,
      packageValue: row.package_value,
      recipientName: row.recipient_name,
      recipientPhone: row.recipient_phone,
      status: row.status,
      estimatedDeliveryTime: row.estimated_delivery_time,
      actualDeliveryTime: row.actual_delivery_time,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}