import { DatabaseService } from '../../database/connection/database.service';
import { TrackingData, CreateTrackingData, UpdateTrackingData, TrackingSession } from '../entities/tracking.entity';
export declare class TrackingRepository {
    private readonly databaseService;
    constructor(databaseService: DatabaseService);
    create(trackingData: CreateTrackingData): Promise<TrackingData>;
    findById(id: string): Promise<TrackingData | null>;
    findByDeliveryId(deliveryId: string, limit?: number): Promise<TrackingData[]>;
    findByDriverId(driverId: string, limit?: number): Promise<TrackingData[]>;
    findLatestByDeliveryId(deliveryId: string): Promise<TrackingData | null>;
    update(id: string, updateData: UpdateTrackingData): Promise<TrackingData | null>;
    updateStatusByDeliveryId(deliveryId: string, status: string): Promise<number>;
    delete(id: string): Promise<boolean>;
    deleteByDeliveryId(deliveryId: string): Promise<number>;
    createSession(deliveryId: string, driverId: string): Promise<TrackingSession>;
    findActiveSession(deliveryId: string): Promise<TrackingSession | null>;
    endSession(sessionId: string, totalDistance?: number, averageSpeed?: number): Promise<TrackingSession | null>;
    private mapToTrackingData;
    private mapToTrackingSession;
}
