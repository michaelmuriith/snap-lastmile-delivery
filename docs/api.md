# SNAP API Documentation

## Overview

The SNAP API is a RESTful API built with NestJS that provides endpoints for the last-mile delivery platform. It supports three main user types: Customers, Drivers, and Admins.

**Base URL:** `http://localhost:3000` (development)  
**Authentication:** JWT Bearer Token  
**Content-Type:** `application/json`



## Health
```http
GET /health
````

## Authentication

All API requests (except authentication endpoints) require a valid JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Register User

Register a new user account.

```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "password": "securepassword123",
  "role": "customer"
}
```

**Response (201 Created):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "role": "customer",
    "isVerified": false
  }
}
```

### Login User

Authenticate and receive JWT tokens.

```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  }
}
```

### Refresh Token

Get a new access token using refresh token.

```http
POST /auth/refresh
Content-Type: application/json
Authorization: Bearer <refresh-token>

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Logout User

Invalidate the current session.

```http
POST /auth/logout
Authorization: Bearer <access-token>
```

**Response (200 OK):**
```json
{
  "message": "Logged out successfully"
}
```

### Get User Profile

Get current user profile information.

```http
GET /auth/profile
Authorization: Bearer <access-token>
```

**Response (200 OK):**
```json
{
  "id": "uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "role": "customer",
  "isVerified": true,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

## Users Management

### Get All Users (Admin Only)

```http
GET /users
Authorization: Bearer <admin-access-token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `role` (optional): Filter by role

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "role": "customer",
      "isVerified": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

### Get User by ID

```http
GET /users/:id
Authorization: Bearer <access-token>
```

**Response (200 OK):**
```json
{
  "id": "uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "role": "customer",
  "isVerified": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Update User

```http
PUT /users/:id
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "name": "John Smith",
  "phone": "+1987654321"
}
```

**Response (200 OK):**
```json
{
  "id": "uuid",
  "name": "John Smith",
  "email": "john@example.com",
  "phone": "+1987654321",
  "role": "customer",
  "isVerified": true,
  "updatedAt": "2024-01-01T12:00:00.000Z"
}
```

## Deliveries Management

### Create Delivery Request

```http
POST /deliveries
Authorization: Bearer <customer-access-token>
Content-Type: application/json

{
  "type": "send",
  "pickupAddress": "123 Main St, City, State",
  "pickupCoordinates": {
    "latitude": 40.7128,
    "longitude": -74.0060
  },
  "deliveryAddress": "456 Oak Ave, City, State",
  "deliveryCoordinates": {
    "latitude": 40.7589,
    "longitude": -73.9851
  },
  "packageDescription": "Small package with documents",
  "packageValue": 50.00,
  "recipientName": "Jane Smith",
  "recipientPhone": "+1234567891"
}
```

**Response (201 Created):**
```json
{
  "id": "uuid",
  "customerId": "uuid",
  "type": "send",
  "pickupAddress": "123 Main St, City, State",
  "deliveryAddress": "456 Oak Ave, City, State",
  "packageDescription": "Small package with documents",
  "status": "pending",
  "estimatedDeliveryTime": "2024-01-01T18:00:00.000Z",
  "createdAt": "2024-01-01T10:00:00.000Z"
}
```

### Get User Deliveries

```http
GET /deliveries
Authorization: Bearer <access-token>
```

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `status` (optional): Filter by status

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "uuid",
      "type": "send",
      "pickupAddress": "123 Main St",
      "deliveryAddress": "456 Oak Ave",
      "status": "assigned",
      "estimatedDeliveryTime": "2024-01-01T18:00:00.000Z",
      "driver": {
        "id": "uuid",
        "name": "Driver Name",
        "phone": "+1234567892"
      },
      "createdAt": "2024-01-01T10:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1
  }
}
```

### Get Delivery Details

```http
GET /deliveries/:id
Authorization: Bearer <access-token>
```

**Response (200 OK):**
```json
{
  "id": "uuid",
  "customerId": "uuid",
  "driverId": "uuid",
  "type": "send",
  "pickupAddress": "123 Main St, City, State",
  "pickupCoordinates": {
    "latitude": 40.7128,
    "longitude": -74.0060
  },
  "deliveryAddress": "456 Oak Ave, City, State",
  "deliveryCoordinates": {
    "latitude": 40.7589,
    "longitude": -73.9851
  },
  "packageDescription": "Small package with documents",
  "packageValue": 50.00,
  "status": "in_transit",
  "estimatedDeliveryTime": "2024-01-01T18:00:00.000Z",
  "actualDeliveryTime": null,
  "createdAt": "2024-01-01T10:00:00.000Z",
  "updatedAt": "2024-01-01T14:30:00.000Z",
  "customer": {
    "id": "uuid",
    "name": "John Doe",
    "phone": "+1234567890"
  },
  "driver": {
    "id": "uuid",
    "name": "Driver Name",
    "phone": "+1234567892"
  }
}
```

### Update Delivery Status (Driver/Admin)

```http
PUT /deliveries/:id/status
Authorization: Bearer <driver-or-admin-access-token>
Content-Type: application/json

{
  "status": "picked_up"
}
```

**Response (200 OK):**
```json
{
  "id": "uuid",
  "status": "picked_up",
  "updatedAt": "2024-01-01T15:00:00.000Z"
}
```

## Real-time Tracking

### Get Delivery Tracking

```http
GET /tracking/:deliveryId
Authorization: Bearer <access-token>
```

**Response (200 OK):**
```json
{
  "deliveryId": "uuid",
  "currentLocation": {
    "latitude": 40.7505,
    "longitude": -73.9934
  },
  "status": "in_transit",
  "estimatedArrival": "2024-01-01T17:30:00.000Z",
  "trackingHistory": [
    {
      "latitude": 40.7128,
      "longitude": -74.0060,
      "timestamp": "2024-01-01T14:00:00.000Z"
    },
    {
      "latitude": 40.7505,
      "longitude": -73.9934,
      "timestamp": "2024-01-01T15:30:00.000Z"
    }
  ]
}
```

### Update Driver Location (Driver Only)

```http
POST /tracking/location
Authorization: Bearer <driver-access-token>
Content-Type: application/json

{
  "deliveryId": "uuid",
  "latitude": 40.7505,
  "longitude": -73.9934,
  "accuracy": 10.5,
  "speed": 25.0,
  "heading": 90.0
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Location updated successfully"
}
```

## Payments

### Process Payment

```http
POST /payments
Authorization: Bearer <customer-access-token>
Content-Type: application/json

{
  "deliveryId": "uuid",
  "amount": 25.50,
  "currency": "USD",
  "paymentMethod": "card",
  "cardToken": "tok_123456789"
}
```

**Response (200 OK):**
```json
{
  "id": "uuid",
  "deliveryId": "uuid",
  "amount": 25.50,
  "currency": "USD",
  "status": "completed",
  "transactionId": "txn_123456789",
  "createdAt": "2024-01-01T16:00:00.000Z"
}
```

### Get Payment History

```http
GET /payments
Authorization: Bearer <access-token>
```

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "uuid",
      "deliveryId": "uuid",
      "amount": 25.50,
      "currency": "USD",
      "status": "completed",
      "transactionId": "txn_123456789",
      "createdAt": "2024-01-01T16:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1
  }
}
```

## Notifications

### Get User Notifications

```http
GET /notifications
Authorization: Bearer <access-token>
```

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `unreadOnly` (optional): Show only unread notifications

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Delivery Assigned",
      "message": "Your delivery has been assigned to a driver",
      "type": "delivery_update",
      "isRead": false,
      "createdAt": "2024-01-01T14:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 3,
    "totalPages": 1
  }
}
```

### Mark Notification as Read

```http
PUT /notifications/:id/read
Authorization: Bearer <access-token>
```

**Response (200 OK):**
```json
{
  "id": "uuid",
  "isRead": true,
  "updatedAt": "2024-01-01T16:00:00.000Z"
}
```

## Admin Endpoints

### Get System Statistics (Admin Only)

```http
GET /admin/stats
Authorization: Bearer <admin-access-token>
```

**Response (200 OK):**
```json
{
  "totalUsers": 1250,
  "activeDeliveries": 45,
  "completedDeliveries": 1250,
  "totalRevenue": 25000.50,
  "activeDrivers": 25,
  "systemHealth": "healthy"
}
```

### Get All Deliveries (Admin Only)

```http
GET /admin/deliveries
Authorization: Bearer <admin-access-token>
```

**Query Parameters:**
- `page`, `limit`, `status`, `dateFrom`, `dateTo`

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "uuid",
      "customer": {
        "name": "John Doe",
        "phone": "+1234567890"
      },
      "driver": {
        "name": "Driver Name",
        "phone": "+1234567892"
      },
      "status": "in_transit",
      "createdAt": "2024-01-01T10:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 150,
    "totalPages": 15
  }
}
```

## Error Responses

### Authentication Error (401)

```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

### Forbidden Error (403)

```json
{
  "statusCode": 403,
  "message": "Forbidden resource",
  "error": "Forbidden"
}
```

### Not Found Error (404)

```json
{
  "statusCode": 404,
  "message": "Resource not found",
  "error": "Not Found"
}
```

### Validation Error (400)

```json
{
  "statusCode": 400,
  "message": [
    "name must be a string",
    "email must be a valid email"
  ],
  "error": "Bad Request"
}
```

### Internal Server Error (500)

```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```

## Rate Limiting

- **General endpoints**: 100 requests per minute per IP
- **Authentication endpoints**: 10 requests per minute per IP
- **Admin endpoints**: 60 requests per minute per user

## WebSocket Events

### Real-time Delivery Updates

Connect to WebSocket at: `ws://localhost:3000`

**Events:**
- `delivery-updated`: Fired when delivery status changes
- `location-updated`: Fired when driver location updates
- `notification-received`: Fired when new notification arrives

**Example:**
```javascript
const socket = io('http://localhost:3000', {
  auth: {
    token: 'your-jwt-token'
  }
});

socket.on('delivery-updated', (data) => {
  console.log('Delivery updated:', data);
});
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Unprocessable Entity
- `500` - Internal Server Error

## SDKs and Libraries

### JavaScript/TypeScript Client

```javascript
class SnapAPI {
  constructor(baseURL, token) {
    this.baseURL = baseURL;
    this.token = token;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    const response = await fetch(url, config);
    return response.json();
  }

  // Authentication
  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  }

  // Deliveries
  async createDelivery(deliveryData) {
    return this.request('/deliveries', {
      method: 'POST',
      body: JSON.stringify(deliveryData)
    });
  }

  async getDeliveries(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/deliveries?${query}`);
  }
}
```

This API documentation provides comprehensive coverage of all endpoints and their usage patterns for the SNAP delivery platform.