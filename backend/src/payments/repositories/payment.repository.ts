import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/connection/database.service';
import { Payment, CreatePaymentData, UpdatePaymentData } from '../entities/payment.entity';

@Injectable()
export class PaymentRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(paymentData: CreatePaymentData): Promise<Payment> {
    const query = `
      INSERT INTO payments (
        delivery_id, customer_id, amount, currency, payment_method,
        payment_gateway, metadata, status, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id, delivery_id, customer_id, amount, currency, status,
                payment_method, transaction_id, payment_gateway, metadata,
                created_at, updated_at
    `;

    const values = [
      paymentData.deliveryId,
      paymentData.customerId,
      paymentData.amount,
      paymentData.currency || 'USD',
      paymentData.paymentMethod || null,
      paymentData.paymentGateway || null,
      paymentData.metadata ? JSON.stringify(paymentData.metadata) : null,
      'pending',
      new Date(),
      new Date(),
    ];

    const result = await this.databaseService.query(query, values);
    return this.mapToPayment(result.rows[0]);
  }

  async findById(id: string): Promise<Payment | null> {
    const query = `
      SELECT id, delivery_id, customer_id, amount, currency, status,
             payment_method, transaction_id, payment_gateway, metadata,
             created_at, updated_at
      FROM payments
      WHERE id = $1
    `;

    const result = await this.databaseService.query(query, [id]);
    return result.rows.length > 0 ? this.mapToPayment(result.rows[0]) : null;
  }

  async findByDeliveryId(deliveryId: string): Promise<Payment[]> {
    const query = `
      SELECT id, delivery_id, customer_id, amount, currency, status,
             payment_method, transaction_id, payment_gateway, metadata,
             created_at, updated_at
      FROM payments
      WHERE delivery_id = $1
      ORDER BY created_at DESC
    `;

    const result = await this.databaseService.query(query, [deliveryId]);
    return result.rows.map(row => this.mapToPayment(row));
  }

  async findByCustomerId(customerId: string, page: number = 1, limit: number = 10): Promise<{ payments: Payment[]; total: number }> {
    const offset = (page - 1) * limit;

    const countQuery = 'SELECT COUNT(*) as total FROM payments WHERE customer_id = $1';
    const dataQuery = `
      SELECT id, delivery_id, customer_id, amount, currency, status,
             payment_method, transaction_id, payment_gateway, metadata,
             created_at, updated_at
      FROM payments
      WHERE customer_id = $1
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `;

    const [countResult, dataResult] = await Promise.all([
      this.databaseService.query(countQuery, [customerId]),
      this.databaseService.query(dataQuery, [customerId, limit, offset]),
    ]);

    return {
      payments: dataResult.rows.map(row => this.mapToPayment(row)),
      total: parseInt(countResult.rows[0].total, 10),
    };
  }

  async findAll(page: number = 1, limit: number = 10, status?: string): Promise<{ payments: Payment[]; total: number }> {
    const offset = (page - 1) * limit;

    let countQuery = 'SELECT COUNT(*) as total FROM payments';
    let dataQuery = `
      SELECT id, delivery_id, customer_id, amount, currency, status,
             payment_method, transaction_id, payment_gateway, metadata,
             created_at, updated_at
      FROM payments
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
      payments: dataResult.rows.map(row => this.mapToPayment(row)),
      total: parseInt(countResult.rows[0].total, 10),
    };
  }

  async update(id: string, updateData: UpdatePaymentData): Promise<Payment | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (updateData.status !== undefined) {
      fields.push(`status = $${paramIndex}`);
      values.push(updateData.status);
      paramIndex++;
    }

    if (updateData.transactionId !== undefined) {
      fields.push(`transaction_id = $${paramIndex}`);
      values.push(updateData.transactionId);
      paramIndex++;
    }

    if (updateData.paymentGateway !== undefined) {
      fields.push(`payment_gateway = $${paramIndex}`);
      values.push(updateData.paymentGateway);
      paramIndex++;
    }

    if (updateData.metadata !== undefined) {
      fields.push(`metadata = $${paramIndex}`);
      values.push(updateData.metadata ? JSON.stringify(updateData.metadata) : null);
      paramIndex++;
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    fields.push(`updated_at = $${paramIndex}`);
    values.push(new Date());
    paramIndex++;

    const query = `
      UPDATE payments
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING id, delivery_id, customer_id, amount, currency, status,
                payment_method, transaction_id, payment_gateway, metadata,
                created_at, updated_at
    `;

    values.push(id);

    const result = await this.databaseService.query(query, values);
    return result.rows.length > 0 ? this.mapToPayment(result.rows[0]) : null;
  }

  async delete(id: string): Promise<boolean> {
    const query = 'DELETE FROM payments WHERE id = $1';
    const result = await this.databaseService.query(query, [id]);
    return result.rowCount > 0;
  }

  private mapToPayment(row: any): Payment {
    return {
      id: row.id,
      deliveryId: row.delivery_id,
      customerId: row.customer_id,
      amount: parseFloat(row.amount),
      currency: row.currency,
      status: row.status,
      paymentMethod: row.payment_method,
      transactionId: row.transaction_id,
      paymentGateway: row.payment_gateway,
      metadata: row.metadata ? JSON.parse(row.metadata) : undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}