export declare class GetDeliveryQuery {
    readonly id: string;
    constructor(id: string);
}
export declare class GetDeliveriesQuery {
    readonly customerId?: string | undefined;
    readonly driverId?: string | undefined;
    readonly status?: string | undefined;
    readonly page: number;
    readonly limit: number;
    constructor(customerId?: string | undefined, driverId?: string | undefined, status?: string | undefined, page?: number, limit?: number);
}
