"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var TrackingGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackingGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const socket_io_1 = require("socket.io");
const jwt_1 = require("@nestjs/jwt");
const cqrs_1 = require("@nestjs/cqrs");
const tracking_entity_1 = require("./entities/tracking.entity");
const update_location_command_1 = require("./commands/update-location.command");
let TrackingGateway = TrackingGateway_1 = class TrackingGateway {
    jwtService;
    commandBus;
    server;
    logger = new common_1.Logger(TrackingGateway_1.name);
    connectedClients = new Map();
    deliverySubscriptions = new Map();
    driverLocations = new Map();
    constructor(jwtService, commandBus) {
        this.jwtService = jwtService;
        this.commandBus = commandBus;
    }
    async handleConnection(client, ...args) {
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
            client.emit('connected', {
                message: 'Connected to tracking service',
                userId: client.userId,
                timestamp: new Date(),
            });
        }
        catch (error) {
            this.logger.error(`Connection failed for client ${client.id}:`, error.message);
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        this.logger.log(`Client disconnected: ${client.id}`);
        this.connectedClients.delete(client.id);
        for (const [deliveryId, clients] of this.deliverySubscriptions.entries()) {
            clients.delete(client.id);
            if (clients.size === 0) {
                this.deliverySubscriptions.delete(deliveryId);
            }
        }
        for (const [driverId, location] of this.driverLocations.entries()) {
            if (driverId === client.userId) {
                this.driverLocations.delete(driverId);
                this.notifyDriverStatusChange(driverId, 'offline');
                break;
            }
        }
    }
    handleSubscribeToDelivery(data, client) {
        const { deliveryId } = data;
        if (!this.deliverySubscriptions.has(deliveryId)) {
            this.deliverySubscriptions.set(deliveryId, new Set());
        }
        this.deliverySubscriptions.get(deliveryId).add(client.id);
        this.logger.log(`Client ${client.id} subscribed to delivery ${deliveryId}`);
        client.emit('subscribed', {
            deliveryId,
            message: 'Successfully subscribed to delivery tracking',
            timestamp: new Date(),
        });
        const latestLocation = Array.from(this.driverLocations.values())
            .find(location => location.deliveryId === deliveryId);
        if (latestLocation) {
            client.emit('location_update', latestLocation);
        }
    }
    handleUnsubscribeFromDelivery(data, client) {
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
    async handleLocationUpdate(data, client) {
        if (client.userRole !== 'driver') {
            client.emit('error', {
                message: 'Only drivers can send location updates',
                timestamp: new Date(),
            });
            return;
        }
        const locationUpdate = {
            ...data,
            timestamp: new Date(),
        };
        try {
            await this.commandBus.execute(new update_location_command_1.UpdateLocationCommand({
                deliveryId: data.deliveryId,
                driverId: client.userId,
                coordinates: {
                    latitude: data.coordinates.latitude,
                    longitude: data.coordinates.longitude,
                    accuracy: data.coordinates.accuracy,
                },
                speed: data.speed,
                heading: data.heading,
            }));
            this.driverLocations.set(client.userId, locationUpdate);
            const subscribers = this.deliverySubscriptions.get(data.deliveryId);
            if (subscribers) {
                subscribers.forEach(clientId => {
                    const subscriberClient = this.connectedClients.get(clientId);
                    if (subscriberClient) {
                        subscriberClient.emit('location_update', locationUpdate);
                    }
                });
            }
            client.emit('location_acknowledged', {
                deliveryId: data.deliveryId,
                timestamp: new Date(),
                message: 'Location update received and broadcasted',
            });
            this.logger.log(`Location update from driver ${client.userId} for delivery ${data.deliveryId}`);
        }
        catch (error) {
            this.logger.error(`Failed to process location update:`, error);
            client.emit('error', {
                message: 'Failed to process location update',
                timestamp: new Date(),
            });
        }
    }
    handleDriverStatusUpdate(data, client) {
        if (client.userRole !== 'driver') {
            client.emit('error', {
                message: 'Only drivers can update status',
                timestamp: new Date(),
            });
            return;
        }
        this.notifyDriverStatusChange(client.userId, data.status, data.coordinates);
        client.emit('status_acknowledged', {
            status: data.status,
            timestamp: new Date(),
            message: 'Driver status updated',
        });
    }
    handlePing(client) {
        client.emit('pong', {
            timestamp: new Date(),
            serverTime: new Date().toISOString(),
        });
    }
    broadcastDeliveryStatusChange(deliveryId, status, driverId) {
        const event = {
            type: tracking_entity_1.TrackingEventType.DELIVERY_STATUS_CHANGE,
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
    broadcastDriverAssignment(deliveryId, driverId) {
        const event = {
            type: tracking_entity_1.TrackingEventType.DRIVER_STATUS_CHANGE,
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
    extractTokenFromHandshake(client) {
        const token = client.handshake.auth?.token ||
            client.handshake.headers?.authorization?.replace('Bearer ', '') ||
            client.handshake.query?.token;
        return token || null;
    }
    notifyDriverStatusChange(driverId, status, coordinates) {
        const event = {
            type: tracking_entity_1.TrackingEventType.DRIVER_STATUS_CHANGE,
            driverId,
            data: { status, coordinates },
            timestamp: new Date(),
        };
        this.server.emit('driver_status_change', event);
        this.logger.log(`Driver ${driverId} status changed to ${status}`);
    }
    getConnectedClientsCount() {
        return this.connectedClients.size;
    }
    getActiveSubscriptions() {
        const subscriptions = {};
        for (const [deliveryId, clients] of this.deliverySubscriptions.entries()) {
            subscriptions[deliveryId] = clients.size;
        }
        return subscriptions;
    }
};
exports.TrackingGateway = TrackingGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], TrackingGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('subscribe_delivery'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], TrackingGateway.prototype, "handleSubscribeToDelivery", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('unsubscribe_delivery'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], TrackingGateway.prototype, "handleUnsubscribeFromDelivery", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('location_update'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TrackingGateway.prototype, "handleLocationUpdate", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('driver_status'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], TrackingGateway.prototype, "handleDriverStatusUpdate", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('ping'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TrackingGateway.prototype, "handlePing", null);
exports.TrackingGateway = TrackingGateway = TrackingGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: process.env.FRONTEND_URL || 'http://localhost:3000',
            credentials: true,
        },
        namespace: '/tracking',
    }),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        cqrs_1.CommandBus])
], TrackingGateway);
//# sourceMappingURL=tracking.gateway.js.map