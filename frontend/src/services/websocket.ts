import { io, Socket } from 'socket.io-client';
import type { LocationUpdate, DeliveryStatusUpdate } from '../types';

export class WebSocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  constructor() {
    this.connect();
  }

  private connect() {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.warn('No access token found, skipping WebSocket connection');
      return;
    }

    this.socket = io(import.meta.env.VITE_WS_URL || 'http://localhost:3000', {
      auth: {
        token: `Bearer ${token}`,
      },
      transports: ['websocket', 'polling'],
    });

    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason: any) => {
      console.log('Disconnected from WebSocket server:', reason);
      this.handleReconnect();
    });

    this.socket.on('connect_error', (error: any) => {
      console.error('WebSocket connection error:', error);
      this.handleReconnect();
    });

    // Delivery tracking events
    this.socket.on('location_update', (data: LocationUpdate) => {
      console.log('Location update received:', data);
      // Emit custom event for React components
      window.dispatchEvent(new CustomEvent('locationUpdate', { detail: data }));
    });

    this.socket.on('delivery_status_update', (data: DeliveryStatusUpdate) => {
      console.log('Delivery status update received:', data);
      window.dispatchEvent(new CustomEvent('deliveryStatusUpdate', { detail: data }));
    });

    this.socket.on('driver_status', (data: { driverId: string; status: string; location?: LocationUpdate }) => {
      console.log('Driver status update received:', data);
      window.dispatchEvent(new CustomEvent('driverStatusUpdate', { detail: data }));
    });
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

      setTimeout(() => {
        this.connect();
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  // Public methods for sending events
  subscribeToDelivery(deliveryId: string) {
    if (this.socket?.connected) {
      this.socket.emit('subscribe_delivery', { deliveryId });
    }
  }

  unsubscribeFromDelivery(deliveryId: string) {
    if (this.socket?.connected) {
      this.socket.emit('unsubscribe_delivery', { deliveryId });
    }
  }

  updateLocation(deliveryId: string, latitude: number, longitude: number) {
    if (this.socket?.connected) {
      this.socket.emit('location_update', {
        deliveryId,
        latitude,
        longitude,
        timestamp: new Date().toISOString(),
      });
    }
  }

  updateDriverStatus(driverId: string, status: string, location?: { latitude: number; longitude: number }) {
    if (this.socket?.connected) {
      this.socket.emit('driver_status', {
        driverId,
        status,
        location: location ? {
          ...location,
          timestamp: new Date().toISOString(),
        } : undefined,
      });
    }
  }

  // Event listeners for React components
  onLocationUpdate(callback: (data: LocationUpdate) => void) {
    const handler = (event: CustomEvent<LocationUpdate>) => callback(event.detail);
    window.addEventListener('locationUpdate', handler as EventListener);
    return () => window.removeEventListener('locationUpdate', handler as EventListener);
  }

  onDeliveryStatusUpdate(callback: (data: DeliveryStatusUpdate) => void) {
    const handler = (event: CustomEvent<DeliveryStatusUpdate>) => callback(event.detail);
    window.addEventListener('deliveryStatusUpdate', handler as EventListener);
    return () => window.removeEventListener('deliveryStatusUpdate', handler as EventListener);
  }

  onDriverStatusUpdate(callback: (data: { driverId: string; status: string; location?: LocationUpdate }) => void) {
    const handler = (event: CustomEvent) => callback(event.detail);
    window.addEventListener('driverStatusUpdate', handler as EventListener);
    return () => window.removeEventListener('driverStatusUpdate', handler as EventListener);
  }

  // Connection management
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  reconnect() {
    this.disconnect();
    this.reconnectAttempts = 0;
    this.connect();
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

// Singleton instance
export const websocketService = new WebSocketService();