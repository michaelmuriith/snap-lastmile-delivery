export declare class GetPaymentQuery {
    readonly id: string;
    constructor(id: string);
}
export declare class GetPaymentsQuery {
    readonly customerId?: string | undefined;
    readonly deliveryId?: string | undefined;
    readonly status?: string | undefined;
    readonly page: number;
    readonly limit: number;
    constructor(customerId?: string | undefined, deliveryId?: string | undefined, status?: string | undefined, page?: number, limit?: number);
}
