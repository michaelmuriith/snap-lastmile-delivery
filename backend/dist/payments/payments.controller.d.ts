import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Payment } from './entities/payment.entity';
export declare class PaymentsController {
    private readonly commandBus;
    private readonly queryBus;
    constructor(commandBus: CommandBus, queryBus: QueryBus);
    createPayment(createPaymentDto: CreatePaymentDto): Promise<Payment>;
    getPayment(id: string): Promise<Payment | null>;
    getPayments(customerId?: string, deliveryId?: string, status?: string, page?: string, limit?: string): Promise<{
        payments: Payment[];
        total: number;
    }>;
    updatePaymentStatus(id: string, body: {
        status: string;
        transactionId?: string;
        metadata?: Record<string, any>;
    }): Promise<Payment | null>;
}
