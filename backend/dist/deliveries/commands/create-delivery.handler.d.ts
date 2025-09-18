import { ICommandHandler } from '@nestjs/cqrs';
import { CreateDeliveryCommand } from './create-delivery.command';
import { Delivery } from '../entities/delivery.entity';
import { DeliveryRepository } from '../repositories/delivery.repository';
export declare class CreateDeliveryHandler implements ICommandHandler<CreateDeliveryCommand> {
    private readonly deliveryRepository;
    constructor(deliveryRepository: DeliveryRepository);
    execute(command: CreateDeliveryCommand): Promise<Delivery>;
}
