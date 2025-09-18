import { Controller, Post, Body, UseGuards, Get, Param, Query, Patch, Put } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { CreateDeliveryCommand } from './commands/create-delivery.command';
import { UpdateDeliveryCommand, AssignDriverCommand, UpdateDeliveryStatusCommand } from './commands/update-delivery.command';
import { GetDeliveryQuery, GetDeliveriesQuery } from './queries/get-delivery.query';
import { Delivery } from './entities/delivery.entity';

@Controller('deliveries')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DeliveriesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @Roles('customer')
  async createDelivery(@Body() createDeliveryDto: CreateDeliveryDto): Promise<Delivery> {
    const command = new CreateDeliveryCommand({
      customerId: createDeliveryDto.customerId,
      type: createDeliveryDto.type,
      pickupAddress: createDeliveryDto.pickupAddress,
      pickupLatitude: createDeliveryDto.pickupLatitude,
      pickupLongitude: createDeliveryDto.pickupLongitude,
      deliveryAddress: createDeliveryDto.deliveryAddress,
      deliveryLatitude: createDeliveryDto.deliveryLatitude,
      deliveryLongitude: createDeliveryDto.deliveryLongitude,
      packageDescription: createDeliveryDto.packageDescription,
      packageValue: createDeliveryDto.packageValue,
      recipientName: createDeliveryDto.recipientName,
      recipientPhone: createDeliveryDto.recipientPhone,
    });

    return this.commandBus.execute(command);
  }

  @Get(':id')
  @Roles('customer', 'driver', 'admin')
  async getDelivery(@Param('id') id: string): Promise<Delivery | null> {
    const query = new GetDeliveryQuery(id);
    return this.queryBus.execute(query);
  }

  @Get()
  @Roles('customer', 'driver', 'admin')
  async getDeliveries(
    @Query('customerId') customerId?: string,
    @Query('driverId') driverId?: string,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<{ deliveries: Delivery[]; total: number }> {
    const query = new GetDeliveriesQuery(
      customerId,
      driverId,
      status,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 10,
    );
    return this.queryBus.execute(query);
  }

  @Put(':id/assign-driver')
  @Roles('admin')
  async assignDriver(
    @Param('id') deliveryId: string,
    @Body('driverId') driverId: string,
  ): Promise<Delivery | null> {
    const command = new AssignDriverCommand(deliveryId, driverId);
    return this.commandBus.execute(command);
  }

  @Patch(':id/status')
  @Roles('driver', 'admin')
  async updateDeliveryStatus(
    @Param('id') deliveryId: string,
    @Body('status') status: string,
    @Body('estimatedDeliveryTime') estimatedDeliveryTime?: Date,
    @Body('actualDeliveryTime') actualDeliveryTime?: Date,
  ): Promise<Delivery | null> {
    const command = new UpdateDeliveryStatusCommand(
      deliveryId,
      status,
      estimatedDeliveryTime,
      actualDeliveryTime,
    );
    return this.commandBus.execute(command);
  }
}