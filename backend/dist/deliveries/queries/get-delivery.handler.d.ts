import { IQueryHandler } from '@nestjs/cqrs';
import { GetDeliveryQuery, GetDeliveriesQuery } from './get-delivery.query';
import { Delivery } from '../entities/delivery.entity';
import { DeliveryRepository } from '../repositories/delivery.repository';
export declare class GetDeliveryHandler implements IQueryHandler<GetDeliveryQuery> {
    private readonly deliveryRepository;
    constructor(deliveryRepository: DeliveryRepository);
    execute(query: GetDeliveryQuery): Promise<Delivery | null>;
}
export declare class GetDeliveriesHandler implements IQueryHandler<GetDeliveriesQuery> {
    private readonly deliveryRepository;
    constructor(deliveryRepository: DeliveryRepository);
    execute(query: GetDeliveriesQuery): Promise<{
        deliveries: Delivery[];
        total: number;
    }>;
}
