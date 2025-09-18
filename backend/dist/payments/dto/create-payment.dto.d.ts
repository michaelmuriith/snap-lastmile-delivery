export declare class CreatePaymentDto {
    deliveryId: string;
    customerId: string;
    amount: number;
    currency?: string;
    paymentMethod?: string;
    paymentGateway?: string;
}
