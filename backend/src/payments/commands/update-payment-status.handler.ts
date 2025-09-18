import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { UpdatePaymentStatusCommand } from './update-payment-status.command';
import { Payment } from '../entities/payment.entity';
import { PaymentRepository } from '../repositories/payment.repository';

@CommandHandler(UpdatePaymentStatusCommand)
export class UpdatePaymentStatusHandler implements ICommandHandler<UpdatePaymentStatusCommand> {
  constructor(
    @Inject('PaymentRepository')
    private readonly paymentRepository: PaymentRepository,
  ) {}

  async execute(command: UpdatePaymentStatusCommand): Promise<Payment | null> {
    const { paymentId, status, transactionId, metadata } = command;

    return this.paymentRepository.update(paymentId, {
      status,
      transactionId,
      metadata,
    });
  }
}