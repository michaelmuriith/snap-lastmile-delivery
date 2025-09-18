import { CreatePaymentData } from '../entities/payment.entity';
export declare class CreatePaymentCommand {
    readonly paymentData: CreatePaymentData;
    constructor(paymentData: CreatePaymentData);
}
export declare class UpdatePaymentStatusCommand {
    readonly paymentId: string;
    readonly status: string;
    readonly transactionId?: string | undefined;
    readonly metadata?: Record<string, any> | undefined;
    constructor(paymentId: string, status: string, transactionId?: string | undefined, metadata?: Record<string, any> | undefined);
}
