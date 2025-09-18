import { UpdateDeliveryData } from '../entities/delivery.entity';

export class UpdateDeliveryCommand {
  constructor(
    public readonly id: string,
    public readonly updateData: UpdateDeliveryData,
  ) {}
}

export class AssignDriverCommand {
  constructor(
    public readonly deliveryId: string,
    public readonly driverId: string,
  ) {}
}

export class UpdateDeliveryStatusCommand {
  constructor(
    public readonly deliveryId: string,
    public readonly status: string,
    public readonly estimatedDeliveryTime?: Date,
    public readonly actualDeliveryTime?: Date,
  ) {}
}