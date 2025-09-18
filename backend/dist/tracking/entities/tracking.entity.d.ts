export interface Coordinates {
    latitude: number;
    longitude: number;
    accuracy?: number;
    timestamp: Date;
}
export interface TrackingData {
    id: string;
    deliveryId: string;
    driverId: string;
    coordinates: Coordinates;
    speed?: number;
    heading?: number;
    status: 'active' | 'inactive' | 'completed';
    createdAt: Date;
    updatedAt: Date;
}
export interface CreateTrackingData {
    deliveryId: string;
    driverId: string;
    coordinates: Omit<Coordinates, 'timestamp'>;
    speed?: number;
    heading?: number;
}
export interface UpdateTrackingData {
    coordinates?: Omit<Coordinates, 'timestamp'>;
    speed?: number;
    heading?: number;
    status?: 'active' | 'inactive' | 'completed';
}
export interface TrackingSession {
    deliveryId: string;
    driverId: string;
    startTime: Date;
    endTime?: Date;
    status: 'active' | 'completed' | 'cancelled';
    totalDistance?: number;
    averageSpeed?: number;
}
export declare enum TrackingEventType {
    LOCATION_UPDATE = "location_update",
    TRACKING_START = "tracking_start",
    TRACKING_STOP = "tracking_stop",
    DELIVERY_STATUS_CHANGE = "delivery_status_change",
    DRIVER_STATUS_CHANGE = "driver_status_change"
}
export interface TrackingEvent {
    type: TrackingEventType;
    deliveryId: string;
    driverId?: string;
    data: any;
    timestamp: Date;
}
export interface LocationUpdateMessage {
    deliveryId: string;
    driverId: string;
    coordinates: Coordinates;
    speed?: number;
    heading?: number;
    timestamp: Date;
}
export interface TrackingSubscriptionMessage {
    deliveryId: string;
    action: 'subscribe' | 'unsubscribe';
}
export interface DriverStatusMessage {
    driverId: string;
    status: 'online' | 'offline' | 'busy';
    coordinates?: Coordinates;
}
