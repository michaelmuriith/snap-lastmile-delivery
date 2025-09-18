import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DatabaseModule } from '../database/database.module';
import { PaymentRepository } from './repositories/payment.repository';
import { CreatePaymentHandler } from './commands/create-payment.handler';
import { UpdatePaymentStatusHandler } from './commands/update-payment-status.handler';
import { GetPaymentHandler } from './queries/get-payment.handler';
import { PaymentsController } from './payments.controller';

@Module({
  imports: [CqrsModule, DatabaseModule],
  controllers: [PaymentsController],
  providers: [
    {
      provide: 'PaymentRepository',
      useClass: PaymentRepository,
    },
    CreatePaymentHandler,
    UpdatePaymentStatusHandler,
    GetPaymentHandler,
  ],
  exports: ['PaymentRepository'],
})
export class PaymentsModule {}