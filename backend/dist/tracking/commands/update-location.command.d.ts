import { CreateTrackingData } from '../entities/tracking.entity';
export declare class UpdateLocationCommand {
    readonly trackingData: CreateTrackingData;
    constructor(trackingData: CreateTrackingData);
}
