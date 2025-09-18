import { DatabaseService } from '../../database/connection/database.service';
import { Delivery, CreateDeliveryData, UpdateDeliveryData } from '../entities/delivery.entity';
export declare class DeliveryRepository {
    private readonly databaseService;
    constructor(databaseService: DatabaseService);
    create(deliveryData: CreateDeliveryData): Promise<Delivery>;
    findById(id: string): Promise<Delivery | null>;
    findByCustomerId(customerId: string, page?: number, limit?: number): Promise<{
        deliveries: Delivery[];
        total: number;
    }>;
    findByDriverId(driverId: string, page?: number, limit?: number): Promise<{
        deliveries: Delivery[];
        total: number;
    }>;
    findAll(page?: number, limit?: number, status?: string): Promise<{
        deliveries: Delivery[];
        total: number;
    }>;
    update(id: string, updateData: UpdateDeliveryData): Promise<Delivery | null>;
    delete(id: string): Promise<boolean>;
    private mapToDelivery;
}
