import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Logger, UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { CommandBus } from '@nestjs/cqrs';
import {
  TrackingEventType,
  LocationUpdateMessage,
} from './entities/tracking.entity';
import type {
  TrackingSubscriptionMessage,
  DriverStatusMessage,
} from './entities/tracking.entity';
import { UpdateLocationCommand } from './commands/update-location.command';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userRole?: string;
}

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
  namespace: '/tracking',
})
export class TrackingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(TrackingGateway.name);
  private readonly connectedClients = new Map<string, AuthenticatedSocket>();
  private readonly deliverySubscriptions = new Map<string, Set<string>>(); // deliveryId -> Set of clientIds
  private readonly driverLocations = new Map<string, LocationUpdateMessage>(); // driverId -> latest location

  constructor(
    private readonly jwtService: JwtService,
    private readonly commandBus: CommandBus,
  ) {}

  async handleConnection(client: AuthenticatedSocket, ...args: any[]) {
    try {
      const token = this.extractTokenFromHandshake(client);
      if (!token) {
        this.logger.warn(`Connection rejected: No token provided for client ${client.id}`);
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token);
      client.userId = payload.sub;
      client.userRole = payload.role;

      this.connectedClients.set(client.id, client);
      this.logger.log(`Client connected: ${client.id} (User: ${client.userId}, Role: ${client.userRole})`);

      // Send welcome message
      client.emit('connected', {
        message: 'Connected to tracking service',
        userId: client.userId,
        timestamp: new Date(),
      });

    } catch (error) {
      this.logger.error(`Connection failed for client ${client.id}:`, error.message);
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    this.logger.log(`Client disconnected: ${client.id}`);

    // Remove from connected clients
    this.connectedClients.delete(client.id);

    // Remove from all delivery subscriptions
    for (const [deliveryId, clients] of this.deliverySubscriptions.entries()) {
      clients.delete(client.id);
      if (clients.size === 0) {
        this.deliverySubscriptions.delete(deliveryId);
      }
    }

    // Remove driver location if this was a driver
    for (const [driverId, location] of this.driverLocations.entries()) {
      if (driverId === client.userId) {
        this.driverLocations.delete(driverId);
        // Notify subscribers that driver went offline
        this.notifyDriverStatusChange(driverId, 'offline');
        break;
      }
    }
  }

  @SubscribeMessage('subscribe_delivery')
  handleSubscribeToDelivery(
    @MessageBody() data: TrackingSubscriptionMessage,
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const { deliveryId } = data;

    if (!this.deliverySubscriptions.has(deliveryId)) {
      this.deliverySubscriptions.set(deliveryId, new Set());
    }

    this.deliverySubscriptions.get(deliveryId)!.add(client.id);

    this.logger.log(`Client ${client.id} subscribed to delivery ${deliveryId}`);

    // Send confirmation
    client.emit('subscribed', {
      deliveryId,
      message: 'Successfully subscribed to delivery tracking',
      timestamp: new Date(),
    });

    // Send latest location if available
    const latestLocation = Array.from(this.driverLocations.values())
      .find(location => location.deliveryId === deliveryId);

    if (latestLocation) {
      client.emit('location_update', latestLocation);
    }
  }

  @SubscribeMessage('unsubscribe_delivery')
  handleUnsubscribeFromDelivery(
    @MessageBody() data: TrackingSubscriptionMessage,
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const { deliveryId } = data;

    const subscribers = this.deliverySubscriptions.get(deliveryId);
    if (subscribers) {
      subscribers.delete(client.id);
      if (subscribers.size === 0) {
        this.deliverySubscriptions.delete(deliveryId);
      }
    }

    this.logger.log(`Client ${client.id} unsubscribed from delivery ${deliveryId}`);

    client.emit('unsubscribed', {
      deliveryId,
      message: 'Successfully unsubscribed from delivery tracking',
      timestamp: new Date(),
    });
  }

  @SubscribeMessage('location_update')
  async handleLocationUpdate(
    @MessageBody() data: Omit<LocationUpdateMessage, 'timestamp'>,
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    // Only drivers can send location updates
    if (client.userRole !== 'driver') {
      client.emit('error', {
        message: 'Only drivers can send location updates',
        timestamp: new Date(),
      });
      return;
    }

    const locationUpdate: LocationUpdateMessage = {
      ...data,
      timestamp: new Date(),
    };

    try {
      // Save location to database via CQRS command
      await this.commandBus.execute(new UpdateLocationCommand({
        deliveryId: data.deliveryId,
        driverId: client.userId!,
        coordinates: {
          latitude: data.coordinates.latitude,
          longitude: data.coordinates.longitude,
          accuracy: data.coordinates.accuracy,
        },
        speed: data.speed,
        heading: data.heading,
      }));

      // Update in-memory location cache
      this.driverLocations.set(client.userId!, locationUpdate);

      // Broadcast to all subscribers of this delivery
      const subscribers = this.deliverySubscriptions.get(data.deliveryId);
      if (subscribers) {
        subscribers.forEach(clientId => {
          const subscriberClient = this.connectedClients.get(clientId);
          if (subscriberClient) {
            subscriberClient.emit('location_update', locationUpdate);
          }
        });
      }

      // Send confirmation to driver
      client.emit('location_acknowledged', {
        deliveryId: data.deliveryId,
        timestamp: new Date(),
        message: 'Location update received and broadcasted',
      });

      this.logger.log(`Location update from driver ${client.userId} for delivery ${data.deliveryId}`);

    } catch (error) {
      this.logger.error(`Failed to process location update:`, error);
      client.emit('error', {
        message: 'Failed to process location update',
        timestamp: new Date(),
      });
    }
  }

  @SubscribeMessage('driver_status')
  handleDriverStatusUpdate(
    @MessageBody() data: DriverStatusMessage,
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    // Only drivers can update their status
    if (client.userRole !== 'driver') {
      client.emit('error', {
        message: 'Only drivers can update status',
        timestamp: new Date(),
      });
      return;
    }

    this.notifyDriverStatusChange(client.userId!, data.status, data.coordinates);

    client.emit('status_acknowledged', {
      status: data.status,
      timestamp: new Date(),
      message: 'Driver status updated',
    });
  }

  @SubscribeMessage('ping')
  handlePing(@ConnectedSocket() client: AuthenticatedSocket) {
    client.emit('pong', {
      timestamp: new Date(),
      serverTime: new Date().toISOString(),
    });
  }

  // Public methods for other services to broadcast events
  broadcastDeliveryStatusChange(deliveryId: string, status: string, driverId?: string) {
    const event = {
      type: TrackingEventType.DELIVERY_STATUS_CHANGE,
      deliveryId,
      driverId,
      data: { status },
      timestamp: new Date(),
    };

    const subscribers = this.deliverySubscriptions.get(deliveryId);
    if (subscribers) {
      subscribers.forEach(clientId => {
        const client = this.connectedClients.get(clientId);
        if (client) {
          client.emit('delivery_status_change', event);
        }
      });
    }
  }

  broadcastDriverAssignment(deliveryId: string, driverId: string) {
    const event = {
      type: TrackingEventType.DRIVER_STATUS_CHANGE,
      deliveryId,
      driverId,
      data: { action: 'assigned' },
      timestamp: new Date(),
    };

    const subscribers = this.deliverySubscriptions.get(deliveryId);
    if (subscribers) {
      subscribers.forEach(clientId => {
        const client = this.connectedClients.get(clientId);
        if (client) {
          client.emit('driver_assigned', event);
        }
      });
    }
  }

  private extractTokenFromHandshake(client: AuthenticatedSocket): string | null {
    const token = client.handshake.auth?.token ||
                  client.handshake.headers?.authorization?.replace('Bearer ', '') ||
                  client.handshake.query?.token as string;

    return token || null;
  }

  private notifyDriverStatusChange(driverId: string, status: 'online' | 'offline' | 'busy', coordinates?: any) {
    const event = {
      type: TrackingEventType.DRIVER_STATUS_CHANGE,
      driverId,
      data: { status, coordinates },
      timestamp: new Date(),
    };

    // Broadcast to all connected clients (could be filtered by role/location in production)
    this.server.emit('driver_status_change', event);

    this.logger.log(`Driver ${driverId} status changed to ${status}`);
  }

  // Utility method to get connected clients count
  getConnectedClientsCount(): number {
    return this.connectedClients.size;
  }

  // Utility method to get active subscriptions
  getActiveSubscriptions(): Record<string, number> {
    const subscriptions: Record<string, number> = {};
    for (const [deliveryId, clients] of this.deliverySubscriptions.entries()) {
      subscriptions[deliveryId] = clients.size;
    }
    return subscriptions;
  }
}