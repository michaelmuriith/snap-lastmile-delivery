import { CreateDeliveryData } from '../entities/delivery.entity';

export class CreateDeliveryCommand {
  constructor(
    public readonly deliveryData: CreateDeliveryData,
  ) {}
}