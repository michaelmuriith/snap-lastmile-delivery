import { ICommandHandler } from '@nestjs/cqrs';
import { UpdateDeliveryCommand, AssignDriverCommand, UpdateDeliveryStatusCommand } from './update-delivery.command';
import { Delivery } from '../entities/delivery.entity';
import { DeliveryRepository } from '../repositories/delivery.repository';
export declare class UpdateDeliveryHandler implements ICommandHandler<UpdateDeliveryCommand> {
    private readonly deliveryRepository;
    constructor(deliveryRepository: DeliveryRepository);
    execute(command: UpdateDeliveryCommand): Promise<Delivery | null>;
}
export declare class AssignDriverHandler implements ICommandHandler<AssignDriverCommand> {
    private readonly deliveryRepository;
    constructor(deliveryRepository: DeliveryRepository);
    execute(command: AssignDriverCommand): Promise<Delivery | null>;
}
export declare class UpdateDeliveryStatusHandler implements ICommandHandler<UpdateDeliveryStatusCommand> {
    private readonly deliveryRepository;
    constructor(deliveryRepository: DeliveryRepository);
    execute(command: UpdateDeliveryStatusCommand): Promise<Delivery | null>;
}
