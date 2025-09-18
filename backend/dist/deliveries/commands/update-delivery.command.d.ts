import { UpdateDeliveryData } from '../entities/delivery.entity';
export declare class UpdateDeliveryCommand {
    readonly id: string;
    readonly updateData: UpdateDeliveryData;
    constructor(id: string, updateData: UpdateDeliveryData);
}
export declare class AssignDriverCommand {
    readonly deliveryId: string;
    readonly driverId: string;
    constructor(deliveryId: string, driverId: string);
}
export declare class UpdateDeliveryStatusCommand {
    readonly deliveryId: string;
    readonly status: string;
    readonly estimatedDeliveryTime?: Date | undefined;
    readonly actualDeliveryTime?: Date | undefined;
    constructor(deliveryId: string, status: string, estimatedDeliveryTime?: Date | undefined, actualDeliveryTime?: Date | undefined);
}
