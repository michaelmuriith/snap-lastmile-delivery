import { DatabaseService } from '../../database/connection/database.service';
import { Payment, CreatePaymentData, UpdatePaymentData } from '../entities/payment.entity';
export declare class PaymentRepository {
    private readonly databaseService;
    constructor(databaseService: DatabaseService);
    create(paymentData: CreatePaymentData): Promise<Payment>;
    findById(id: string): Promise<Payment | null>;
    findByDeliveryId(deliveryId: string): Promise<Payment[]>;
    findByCustomerId(customerId: string, page?: number, limit?: number): Promise<{
        payments: Payment[];
        total: number;
    }>;
    findAll(page?: number, limit?: number, status?: string): Promise<{
        payments: Payment[];
        total: number;
    }>;
    update(id: string, updateData: UpdatePaymentData): Promise<Payment | null>;
    delete(id: string): Promise<boolean>;
    private mapToPayment;
}
