# SNAP Boilerplate Code Stubs

## Frontend Components

### Customer Dashboard Page

```tsx
// src/pages/customer/Dashboard.tsx
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useDeliveryStore } from '@/stores/deliveryStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapContainer } from '@/components/maps/MapContainer';
import { DeliveryList } from '@/features/delivery/components/DeliveryList';
import { useWebSocket } from '@/hooks/useWebSocket';

export const CustomerDashboard = () => {
  const { user } = useAuthStore();
  const { deliveries, fetchDeliveries, createDelivery } = useDeliveryStore();
  const [isCreating, setIsCreating] = useState(false);

  useWebSocket('delivery-updates', (data) => {
    // Handle real-time delivery updates
    fetchDeliveries();
  });

  useEffect(() => {
    fetchDeliveries();
  }, [fetchDeliveries]);

  const handleCreateDelivery = async (deliveryData: CreateDeliveryData) => {
    setIsCreating(true);
    try {
      await createDelivery(deliveryData);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome, {user?.name}
            </h1>
            <Button
              onClick={() => handleCreateDelivery({ /* delivery data */ })}
              disabled={isCreating}
            >
              {isCreating ? 'Creating...' : 'New Delivery'}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Active Deliveries</CardTitle>
              </CardHeader>
              <CardContent>
                <DeliveryList deliveries={deliveries} />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Active Deliveries</span>
                    <span className="font-semibold">
                      {deliveries.filter(d => d.status === 'active').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Completed Today</span>
                    <span className="font-semibold">12</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Live Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <MapContainer
                  height="300px"
                  markers={deliveries.map(d => ({
                    id: d.id,
                    position: d.currentLocation,
                    type: 'delivery'
                  }))}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};
```

### Shared UI Component

```tsx
// src/components/ui/DeliveryCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { Button } from './button';
import { Delivery } from '@/types/delivery';

interface DeliveryCardProps {
  delivery: Delivery;
  onViewDetails?: (id: string) => void;
  onTrack?: (id: string) => void;
}

export const DeliveryCard = ({
  delivery,
  onViewDetails,
  onTrack
}: DeliveryCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'assigned': return 'bg-blue-100 text-blue-800';
      case 'picked_up': return 'bg-purple-100 text-purple-800';
      case 'in_transit': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">
            Delivery #{delivery.id.slice(-8)}
          </CardTitle>
          <Badge className={getStatusColor(delivery.status)}>
            {delivery.status.replace('_', ' ').toUpperCase()}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-600">From</p>
            <p className="font-medium">{delivery.pickupAddress}</p>
          </div>

          <div>
            <p className="text-sm text-gray-600">To</p>
            <p className="font-medium">{delivery.deliveryAddress}</p>
          </div>

          {delivery.driver && (
            <div>
              <p className="text-sm text-gray-600">Driver</p>
              <p className="font-medium">{delivery.driver.name}</p>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            {onViewDetails && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewDetails(delivery.id)}
              >
                Details
              </Button>
            )}
            {onTrack && delivery.status === 'in_transit' && (
              <Button
                size="sm"
                onClick={() => onTrack(delivery.id)}
              >
                Track
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
```

## Backend Modules

### Auth Controller

```typescript
// src/modules/auth/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Request,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Request() req, @Body() loginDto: LoginDto) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Request() req) {
    return this.authService.logout(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
```

### Auth Service

```typescript
// src/modules/auth/auth.service.ts
import {
  Injectable,
  UnauthorizedException,
  ConflictException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 12);
    const user = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
    });

    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: await this.generateRefreshToken(user.id),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: await this.generateRefreshToken(user.id),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const user = await this.usersService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const newPayload = { email: user.email, sub: user.id, role: user.role };
      return {
        access_token: this.jwtService.sign(newPayload),
        refresh_token: await this.generateRefreshToken(user.id),
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string) {
    // Invalidate refresh token in Redis/database
    return { message: 'Logged out successfully' };
  }

  private async generateRefreshToken(userId: string): Promise<string> {
    const payload = { sub: userId };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });
  }
}
```

### Delivery CQRS Command Handler

```typescript
// src/modules/deliveries/commands/create-delivery.handler.ts
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateDeliveryCommand } from './create-delivery.command';
import { DeliveryRepository } from '../repositories/delivery.repository';
import { DeliveryCreatedEvent } from '../events/delivery-created.event';
import { EventBus } from '@nestjs/cqrs';

@CommandHandler(CreateDeliveryCommand)
export class CreateDeliveryHandler
  implements ICommandHandler<CreateDeliveryCommand> {
  constructor(
    @Inject('DeliveryRepository')
    private readonly deliveryRepository: DeliveryRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateDeliveryCommand): Promise<any> {
    const { createDeliveryDto, userId } = command;

    // Create delivery using raw SQL
    const delivery = await this.deliveryRepository.create({
      ...createDeliveryDto,
      customerId: userId,
      status: 'pending',
      createdAt: new Date(),
    });

    // Publish domain event
    this.eventBus.publish(
      new DeliveryCreatedEvent(delivery.id, delivery.customerId)
    );

    return delivery;
  }
}
```

### Database Connection Service

```typescript
// src/database/connection/database.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      max: 20, // Maximum number of connections
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    this.pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
    });
  }

  async onModuleInit() {
    // Test connection
    const client = await this.pool.connect();
    try {
      await client.query('SELECT NOW()');
      console.log('Database connected successfully');
    } finally {
      client.release();
    }
  }

  getPool(): Pool {
    return this.pool;
  }

  async query(text: string, params?: any[]): Promise<any> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(text, params);
      return result;
    } finally {
      client.release();
    }
  }

  async getClient(): Promise<any> {
    return await this.pool.connect();
  }
}
```

### User Repository with Raw SQL

```typescript
// src/modules/users/repositories/user.repository.ts
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/connection/database.service';
import { User } from '../../types/user';

@Injectable()
export class UserRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(userData: Partial<User>): Promise<User> {
    const query = `
      INSERT INTO users (name, email, phone, password, role, is_verified, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, name, email, phone, role, is_verified, created_at, updated_at
    `;

    const values = [
      userData.name,
      userData.email,
      userData.phone,
      userData.password,
      userData.role,
      userData.isVerified || false,
      new Date(),
      new Date(),
    ];

    const result = await this.databaseService.query(query, values);
    return result.rows[0];
  }

  async findByEmail(email: string): Promise<User | null> {
    const query = `
      SELECT id, name, email, phone, password, role, is_verified, created_at, updated_at
      FROM users
      WHERE email = $1
    `;

    const result = await this.databaseService.query(query, [email]);
    return result.rows[0] || null;
  }

  async findById(id: string): Promise<User | null> {
    const query = `
      SELECT id, name, email, phone, role, is_verified, created_at, updated_at
      FROM users
      WHERE id = $1
    `;

    const result = await this.databaseService.query(query, [id]);
    return result.rows[0] || null;
  }

  async update(id: string, updateData: Partial<User>): Promise<User | null> {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        fields.push(`${key} = $${paramIndex}`);
        values.push(updateData[key]);
        paramIndex++;
      }
    });

    if (fields.length === 0) return null;

    values.push(id);
    const query = `
      UPDATE users
      SET ${fields.join(', ')}, updated_at = NOW()
      WHERE id = $${paramIndex}
      RETURNING id, name, email, phone, role, is_verified, created_at, updated_at
    `;

    const result = await this.databaseService.query(query, values);
    return result.rows[0] || null;
  }
}
```

## Shared Types

### User Types

```typescript
// src/types/user.ts
export type UserRole = 'customer' | 'driver' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDto {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
}

export interface UpdateUserDto {
  name?: string;
  phone?: string;
  isVerified?: boolean;
}

export interface UserResponseDto {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: Date;
}
```

### Delivery Types

```typescript
// src/types/delivery.ts
export type DeliveryStatus =
  | 'pending'
  | 'assigned'
  | 'picked_up'
  | 'in_transit'
  | 'delivered'
  | 'cancelled';

export type DeliveryType = 'send' | 'receive' | 'store_pickup';

export interface Delivery {
  id: string;
  customerId: string;
  driverId?: string;
  type: DeliveryType;
  pickupAddress: string;
  pickupCoordinates: Coordinates;
  deliveryAddress: string;
  deliveryCoordinates: Coordinates;
  packageDescription: string;
  packageValue?: number;
  status: DeliveryStatus;
  estimatedDeliveryTime?: Date;
  actualDeliveryTime?: Date;
  createdAt: Date;
  updatedAt: Date;
  customer?: User;
  driver?: User;
  currentLocation?: Coordinates;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface CreateDeliveryDto {
  type: DeliveryType;
  pickupAddress: string;
  pickupCoordinates: Coordinates;
  deliveryAddress: string;
  deliveryCoordinates: Coordinates;
  packageDescription: string;
  packageValue?: number;
  recipientName?: string;
  recipientPhone?: string;
}

export interface DeliveryResponseDto {
  id: string;
  type: DeliveryType;
  pickupAddress: string;
  deliveryAddress: string;
  packageDescription: string;
  status: DeliveryStatus;
  estimatedDeliveryTime?: Date;
  createdAt: Date;
  driver?: {
    id: string;
    name: string;
    phone: string;
  };
  trackingUrl?: string;
}
```

### API Response Types

```typescript
// src/types/api.ts
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ErrorResponse {
  success: false;
  message: string;
  errors: string[];
  code?: string;
}
```

These boilerplate stubs provide a solid foundation for implementing the SNAP application. They demonstrate best practices for React components, NestJS modules, CQRS patterns, and TypeScript type definitions. The code is modular, type-safe, and follows the architectural patterns outlined in the system design.