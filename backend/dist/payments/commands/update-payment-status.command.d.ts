import { PaymentStatus } from '../entities/payment.entity';
export declare class UpdatePaymentStatusCommand {
    readonly paymentId: string;
    readonly status: PaymentStatus;
    readonly transactionId?: string | undefined;
    readonly metadata?: Record<string, any> | undefined;
    constructor(paymentId: string, status: PaymentStatus, transactionId?: string | undefined, metadata?: Record<string, any> | undefined);
}
