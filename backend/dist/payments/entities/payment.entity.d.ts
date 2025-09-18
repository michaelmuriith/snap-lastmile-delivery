export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
export interface Payment {
    id: string;
    deliveryId: string;
    customerId: string;
    amount: number;
    currency: string;
    status: PaymentStatus;
    paymentMethod?: string;
    transactionId?: string;
    paymentGateway?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
export interface CreatePaymentData {
    deliveryId: string;
    customerId: string;
    amount: number;
    currency?: string;
    paymentMethod?: string;
    paymentGateway?: string;
    metadata?: Record<string, any>;
}
export interface UpdatePaymentData {
    status?: PaymentStatus;
    transactionId?: string;
    paymentGateway?: string;
    metadata?: Record<string, any>;
}
