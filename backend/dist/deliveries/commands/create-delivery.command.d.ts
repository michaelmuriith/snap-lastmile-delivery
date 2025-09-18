import { CreateDeliveryData } from '../entities/delivery.entity';
export declare class CreateDeliveryCommand {
    readonly deliveryData: CreateDeliveryData;
    constructor(deliveryData: CreateDeliveryData);
}
