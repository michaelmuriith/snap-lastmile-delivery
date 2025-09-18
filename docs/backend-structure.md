# SNAP Backend Module Breakdown

## Overview

The backend is built with NestJS following a modular architecture with clear boundaries. Each module encapsulates specific domain logic, using CQRS pattern for complex operations and Prisma ORM for database interactions.

## Module Structure

```
src/
├── app.module.ts              # Root application module
├── main.ts                    # Application entry point
├── config/                    # Configuration module
│   ├── database.config.ts     # Database configuration
│   ├── redis.config.ts        # Redis configuration
│   ├── jwt.config.ts          # JWT configuration
│   └── app.config.ts          # General app configuration
├── shared/                    # Shared utilities and decorators
│   ├── decorators/            # Custom decorators
│   ├── guards/                # Authentication guards
│   ├── interceptors/          # Response interceptors
│   ├── filters/               # Exception filters
│   ├── dto/                   # Shared DTOs
│   └── utils/                 # Utility functions
├── modules/                   # Feature modules
│   ├── auth/                  # Authentication module
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── jwt.strategy.ts
│   │   ├── local.strategy.ts
│   │   ├── dto/
│   │   │   ├── login.dto.ts
│   │   │   ├── register.dto.ts
│   │   │   └── refresh-token.dto.ts
│   │   └── guards/
│   │       ├── jwt-auth.guard.ts
│   │       └── roles.guard.ts
│   ├── users/                 # User management module
│   │   ├── users.module.ts
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── entities/
│   │   │   └── user.entity.ts
│   │   ├── dto/
│   │   │   ├── create-user.dto.ts
│   │   │   ├── update-user.dto.ts
│   │   │   └── user-response.dto.ts
│   │   └── repositories/
│   │       └── user.repository.ts
│   ├── deliveries/            # Delivery management module (CQRS)
│   │   ├── deliveries.module.ts
│   │   ├── commands/          # CQRS Commands
│   │   │   ├── create-delivery.command.ts
│   │   │   ├── assign-driver.command.ts
│   │   │   └── update-status.command.ts
│   │   ├── queries/           # CQRS Queries
│   │   │   ├── get-delivery.query.ts
│   │   │   └── get-deliveries.query.ts
│   │   ├── handlers/          # Command/Query handlers
│   │   │   ├── create-delivery.handler.ts
│   │   │   ├── assign-driver.handler.ts
│   │   │   └── get-delivery.handler.ts
│   │   ├── controllers/
│   │   │   └── deliveries.controller.ts
│   │   ├── services/
│   │   │   └── deliveries.service.ts
│   │   ├── entities/
│   │   │   ├── delivery.entity.ts
│   │   │   └── delivery-assignment.entity.ts
│   │   ├── dto/
│   │   │   ├── create-delivery.dto.ts
│   │   │   └── delivery-response.dto.ts
│   │   └── events/            # Domain events
│   │       ├── delivery-created.event.ts
│   │       └── delivery-completed.event.ts
│   ├── tracking/              # Real-time tracking module
│   │   ├── tracking.module.ts
│   │   ├── tracking.gateway.ts # WebSocket gateway
│   │   ├── tracking.service.ts
│   │   ├── entities/
│   │   │   └── tracking-session.entity.ts
│   │   ├── dto/
│   │   │   ├── location-update.dto.ts
│   │   │   └── tracking-response.dto.ts
│   │   └── repositories/
│   │       └── tracking.repository.ts
│   ├── payments/              # Payment processing module
│   │   ├── payments.module.ts
│   │   ├── payments.controller.ts
│   │   ├── payments.service.ts
│   │   ├── entities/
│   │   │   └── payment.entity.ts
│   │   ├── dto/
│   │   │   ├── process-payment.dto.ts
│   │   │   └── payment-response.dto.ts
│   │   └── integrations/
│   │       ├── stripe.service.ts
│   │       └── mpesa.service.ts
│   ├── notifications/         # Notification module
│   │   ├── notifications.module.ts
│   │   ├── notifications.service.ts
│   │   ├── dto/
│   │   │   └── send-notification.dto.ts
│   │   └── providers/
│   │       ├── push-notification.provider.ts
│   │       └── email.provider.ts
│   └── admin/                 # Admin operations module
│       ├── admin.module.ts
│       ├── admin.controller.ts
│       ├── admin.service.ts
│       ├── dto/
│       │   ├── system-stats.dto.ts
│       │   └── admin-action.dto.ts
│       └── guards/
│           └── admin-only.guard.ts
├── database/                  # Database related
│   ├── connection/            # Database connection
│   │   ├── database.config.ts # Database configuration
│   │   ├── connection.pool.ts # Connection pooling
│   │   └── migrations/        # SQL migration scripts
│   ├── queries/               # SQL query files
│   │   ├── users.sql          # User-related queries
│   │   ├── deliveries.sql     # Delivery-related queries
│   │   ├── tracking.sql       # Tracking-related queries
│   │   └── payments.sql       # Payment-related queries
│   └── seeds/                 # Database seeds
├── common/                    # Common interfaces and types
│   ├── interfaces/
│   │   ├── base-entity.interface.ts
│   │   └── paginated-response.interface.ts
│   └── types/
│       └── user-role.type.ts
└── test/                      # Test files
    ├── e2e/
    └── unit/
```

## Module Boundaries and Responsibilities

### Auth Module
- Handles user authentication and authorization
- JWT token generation and validation
- Role-based access control (RBAC)
- Password hashing and verification

### Users Module
- User CRUD operations
- Profile management
- User role assignments
- User verification processes

### Deliveries Module (CQRS)
- Delivery request creation and management
- Driver assignment logic
- Delivery status tracking
- Business rules for delivery operations
- Domain events for delivery lifecycle

### Tracking Module
- Real-time GPS position updates
- WebSocket communication for live tracking
- Location history storage
- Driver location broadcasting

### Payments Module
- Payment processing integration
- Mobile money and card payments
- Payment status tracking
- Refund handling

### Notifications Module
- Push notification sending
- Email notifications
- In-app notifications
- Notification preferences

### Admin Module
- System monitoring and statistics
- User management overrides
- Platform configuration
- Audit trail access

## CQRS Implementation

The Deliveries module uses CQRS to separate read and write operations:

- **Commands**: CreateDelivery, AssignDriver, UpdateStatus
- **Queries**: GetDelivery, GetDeliveriesByStatus
- **Events**: DeliveryCreated, DriverAssigned, DeliveryCompleted

This pattern improves performance and scalability for complex business logic.

## Database Design

Using raw SQL with PostgreSQL connection pooling:

- User table with role-based relationships
- Delivery tables with status tracking
- Tracking sessions for GPS data
- Payment transactions
- Audit logs for compliance

### Connection Strategy
- Pg library for connection pooling
- Prepared statements for query optimization
- Transaction management for data consistency
- Connection health monitoring

## Security Considerations

- JWT authentication with refresh tokens
- Role-based guards for API endpoints
- Input validation with class-validator
- Rate limiting and CORS configuration
- Data encryption for sensitive information

This modular structure ensures maintainability, testability, and scalability while following NestJS best practices.