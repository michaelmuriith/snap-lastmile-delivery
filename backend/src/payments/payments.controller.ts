import { Controller, Post, Body, UseGuards, Get, Param, Query, Patch } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { CreatePaymentCommand } from './commands/create-payment.command';
import { UpdatePaymentStatusCommand } from './commands/update-payment-status.command';
import { GetPaymentQuery, GetPaymentsQuery } from './queries/get-payment.query';
import { Payment } from './entities/payment.entity';
import { PaymentStatus } from './entities/payment.entity';

@Controller('payments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PaymentsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @Roles('customer')
  async createPayment(@Body() createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const command = new CreatePaymentCommand({
      deliveryId: createPaymentDto.deliveryId,
      customerId: createPaymentDto.customerId,
      amount: createPaymentDto.amount,
      currency: createPaymentDto.currency,
      paymentMethod: createPaymentDto.paymentMethod,
      paymentGateway: createPaymentDto.paymentGateway,
    });

    return this.commandBus.execute(command);
  }

  @Get(':id')
  @Roles('customer', 'admin')
  async getPayment(@Param('id') id: string): Promise<Payment | null> {
    const query = new GetPaymentQuery(id);
    return this.queryBus.execute(query);
  }

  @Get()
  @Roles('admin')
  async getPayments(
    @Query('customerId') customerId?: string,
    @Query('deliveryId') deliveryId?: string,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<{ payments: Payment[]; total: number }> {
    const query = new GetPaymentsQuery(
      customerId,
      deliveryId,
      status,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 10,
    );
    return this.queryBus.execute(query);
  }

  @Patch(':id/status')
  @Roles('admin')
  async updatePaymentStatus(
    @Param('id') id: string,
    @Body() body: { status: string; transactionId?: string; metadata?: Record<string, any> },
  ): Promise<Payment | null> {
    const command = new UpdatePaymentStatusCommand(
      id,
      body.status as PaymentStatus,
      body.transactionId,
      body.metadata,
    );
    return this.commandBus.execute(command);
  }
}