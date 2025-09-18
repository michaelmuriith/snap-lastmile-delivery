import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { UpdateDeliveryCommand, AssignDriverCommand, UpdateDeliveryStatusCommand } from './update-delivery.command';
import { Delivery } from '../entities/delivery.entity';
import { DeliveryRepository } from '../repositories/delivery.repository';

@CommandHandler(UpdateDeliveryCommand)
export class UpdateDeliveryHandler implements ICommandHandler<UpdateDeliveryCommand> {
  constructor(
    @Inject('DeliveryRepository')
    private readonly deliveryRepository: DeliveryRepository,
  ) {}

  async execute(command: UpdateDeliveryCommand): Promise<Delivery | null> {
    const { id, updateData } = command;
    return this.deliveryRepository.update(id, updateData);
  }
}

@CommandHandler(AssignDriverCommand)
export class AssignDriverHandler implements ICommandHandler<AssignDriverCommand> {
  constructor(
    @Inject('DeliveryRepository')
    private readonly deliveryRepository: DeliveryRepository,
  ) {}

  async execute(command: AssignDriverCommand): Promise<Delivery | null> {
    const { deliveryId, driverId } = command;
    return this.deliveryRepository.update(deliveryId, {
      driverId,
      status: 'assigned',
    });
  }
}

@CommandHandler(UpdateDeliveryStatusCommand)
export class UpdateDeliveryStatusHandler implements ICommandHandler<UpdateDeliveryStatusCommand> {
  constructor(
    @Inject('DeliveryRepository')
    private readonly deliveryRepository: DeliveryRepository,
  ) {}

  async execute(command: UpdateDeliveryStatusCommand): Promise<Delivery | null> {
    const { deliveryId, status, estimatedDeliveryTime, actualDeliveryTime } = command;
    return this.deliveryRepository.update(deliveryId, {
      status: status as any,
      estimatedDeliveryTime,
      actualDeliveryTime,
    });
  }
}