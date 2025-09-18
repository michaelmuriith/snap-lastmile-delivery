// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'driver' | 'admin';
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser extends User {
  accessToken: string;
  refreshToken: string;
}

// Delivery Types
export type DeliveryStatus = 'pending' | 'assigned' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled';
export type DeliveryType = 'send' | 'receive' | 'store_pickup';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Delivery {
  id: string;
  customerId: string;
  driverId?: string;
  type: DeliveryType;
  pickupAddress: string;
  pickupLatitude?: number;
  pickupLongitude?: number;
  deliveryAddress: string;
  deliveryLatitude?: number;
  deliveryLongitude?: number;
  packageDescription: string;
  packageValue?: number;
  recipientName?: string;
  recipientPhone?: string;
  status: DeliveryStatus;
  estimatedDeliveryTime?: string;
  actualDeliveryTime?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDeliveryData {
  customerId: string;
  type: DeliveryType;
  pickupAddress: string;
  pickupLatitude?: number;
  pickupLongitude?: number;
  deliveryAddress: string;
  deliveryLatitude?: number;
  deliveryLongitude?: number;
  packageDescription: string;
  packageValue?: number;
  recipientName?: string;
  recipientPhone?: string;
}

// Payment Types
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'cancelled';

export interface Payment {
  id: string;
  deliveryId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod?: string;
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
}

// Notification Types
export type NotificationType =
  | 'delivery_created'
  | 'delivery_assigned'
  | 'delivery_picked_up'
  | 'delivery_in_transit'
  | 'delivery_delivered'
  | 'delivery_cancelled'
  | 'payment_completed'
  | 'payment_failed'
  | 'system_notification'
  | 'driver_assigned'
  | 'location_update';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  metadata?: Record<string, any>;
  createdAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'customer' | 'driver';
}

export interface CreateDeliveryForm {
  customerId: string;
  type: DeliveryType;
  pickupAddress: string;
  pickupLatitude?: number;
  pickupLongitude?: number;
  deliveryAddress: string;
  deliveryLatitude?: number;
  deliveryLongitude?: number;
  packageDescription: string;
  packageValue?: number;
  recipientName?: string;
  recipientPhone?: string;
}

// WebSocket Types
export interface LocationUpdate {
  deliveryId: string;
  driverId: string;
  latitude: number;
  longitude: number;
  timestamp: string;
}

export interface DeliveryStatusUpdate {
  deliveryId: string;
  status: DeliveryStatus;
  timestamp: string;
  metadata?: Record<string, any>;
}

// Store Types
export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface DeliveryState {
  deliveries: Delivery[];
  currentDelivery: Delivery | null;
  isLoading: boolean;
  error: string | null;
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
}