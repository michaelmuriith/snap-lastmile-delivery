export type DeliveryStatus = 'pending' | 'assigned' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled';
export type DeliveryType = 'send' | 'receive' | 'store_pickup';
export interface Coordinates {
    latitude: number;
    longitude: number;
}
export interface Delivery {
    id: string;
    customerId: string;
    driverId?: string;
    type: DeliveryType;
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
    status: DeliveryStatus;
    estimatedDeliveryTime?: Date;
    actualDeliveryTime?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export interface CreateDeliveryData {
    customerId: string;
    type: DeliveryType;
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
export interface UpdateDeliveryData {
    driverId?: string;
    status?: DeliveryStatus;
    estimatedDeliveryTime?: Date;
    actualDeliveryTime?: Date;
}
