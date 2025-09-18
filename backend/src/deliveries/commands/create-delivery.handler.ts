import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateDeliveryCommand } from './create-delivery.command';
import { Delivery } from '../entities/delivery.entity';
import { DeliveryRepository } from '../repositories/delivery.repository';

@CommandHandler(CreateDeliveryCommand)
export class CreateDeliveryHandler implements ICommandHandler<CreateDeliveryCommand> {
  constructor(
    @Inject('DeliveryRepository')
    private readonly deliveryRepository: DeliveryRepository,
  ) {}

  async execute(command: CreateDeliveryCommand): Promise<Delivery> {
    const { deliveryData } = command;

    return this.deliveryRepository.create(deliveryData);
  }
}