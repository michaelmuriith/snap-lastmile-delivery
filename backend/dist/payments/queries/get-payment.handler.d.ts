import { IQueryHandler } from '@nestjs/cqrs';
import { GetPaymentQuery, GetPaymentsQuery } from './get-payment.query';
import { Payment } from '../entities/payment.entity';
import { PaymentRepository } from '../repositories/payment.repository';
export declare class GetPaymentHandler implements IQueryHandler<GetPaymentQuery> {
    private readonly paymentRepository;
    constructor(paymentRepository: PaymentRepository);
    execute(query: GetPaymentQuery): Promise<Payment | null>;
}
export declare class GetPaymentsHandler implements IQueryHandler<GetPaymentsQuery> {
    private readonly paymentRepository;
    constructor(paymentRepository: PaymentRepository);
    execute(query: GetPaymentsQuery): Promise<{
        payments: Payment[];
        total: number;
    }>;
}
