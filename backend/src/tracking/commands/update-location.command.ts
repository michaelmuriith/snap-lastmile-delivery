import { CreateTrackingData } from '../entities/tracking.entity';

export class UpdateLocationCommand {
  constructor(public readonly trackingData: CreateTrackingData) {}
}