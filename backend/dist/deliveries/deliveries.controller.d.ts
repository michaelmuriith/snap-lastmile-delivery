import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { Delivery } from './entities/delivery.entity';
export declare class DeliveriesController {
    private readonly commandBus;
    private readonly queryBus;
    constructor(commandBus: CommandBus, queryBus: QueryBus);
    createDelivery(createDeliveryDto: CreateDeliveryDto): Promise<Delivery>;
    getDelivery(id: string): Promise<Delivery | null>;
    getDeliveries(customerId?: string, driverId?: string, status?: string, page?: string, limit?: string): Promise<{
        deliveries: Delivery[];
        total: number;
    }>;
    assignDriver(deliveryId: string, driverId: string): Promise<Delivery | null>;
    updateDeliveryStatus(deliveryId: string, status: string, estimatedDeliveryTime?: Date, actualDeliveryTime?: Date): Promise<Delivery | null>;
}
