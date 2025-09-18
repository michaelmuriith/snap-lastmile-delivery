export declare enum DeliveryTypeEnum {
    SEND = "send",
    RECEIVE = "receive",
    STORE_PICKUP = "store_pickup"
}
export declare class CreateDeliveryDto {
    customerId: string;
    type: DeliveryTypeEnum;
    pickupAddress: string;
    pickupLatitude?: number;
    pickupLongitude?: number;
    deliveryAddress: string;
    deliveryLatitude?: number;
    deliveryLongitude?: number;
    packageDescription: string;
    packageValue?: number;
    recipientName?: string;
    recipientPhone?: string;
}
