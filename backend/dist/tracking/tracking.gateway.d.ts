import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { CommandBus } from '@nestjs/cqrs';
import { LocationUpdateMessage } from './entities/tracking.entity';
import type { TrackingSubscriptionMessage, DriverStatusMessage } from './entities/tracking.entity';
interface AuthenticatedSocket extends Socket {
    userId?: string;
    userRole?: string;
}
export declare class TrackingGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly jwtService;
    private readonly commandBus;
    server: Server;
    private readonly logger;
    private readonly connectedClients;
    private readonly deliverySubscriptions;
    private readonly driverLocations;
    constructor(jwtService: JwtService, commandBus: CommandBus);
    handleConnection(client: AuthenticatedSocket, ...args: any[]): Promise<void>;
    handleDisconnect(client: AuthenticatedSocket): void;
    handleSubscribeToDelivery(data: TrackingSubscriptionMessage, client: AuthenticatedSocket): void;
    handleUnsubscribeFromDelivery(data: TrackingSubscriptionMessage, client: AuthenticatedSocket): void;
    handleLocationUpdate(data: Omit<LocationUpdateMessage, 'timestamp'>, client: AuthenticatedSocket): Promise<void>;
    handleDriverStatusUpdate(data: DriverStatusMessage, client: AuthenticatedSocket): void;
    handlePing(client: AuthenticatedSocket): void;
    broadcastDeliveryStatusChange(deliveryId: string, status: string, driverId?: string): void;
    broadcastDriverAssignment(deliveryId: string, driverId: string): void;
    private extractTokenFromHandshake;
    private notifyDriverStatusChange;
    getConnectedClientsCount(): number;
    getActiveSubscriptions(): Record<string, number>;
}
export {};
