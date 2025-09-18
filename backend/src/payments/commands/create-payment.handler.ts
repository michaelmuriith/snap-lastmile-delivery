import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreatePaymentCommand } from './create-payment.command';
import { Payment } from '../entities/payment.entity';
import { PaymentRepository } from '../repositories/payment.repository';

@CommandHandler(CreatePaymentCommand)
export class CreatePaymentHandler implements ICommandHandler<CreatePaymentCommand> {
  constructor(
    @Inject('PaymentRepository')
    private readonly paymentRepository: PaymentRepository,
  ) {}

  async execute(command: CreatePaymentCommand): Promise<Payment> {
    const { paymentData } = command;

    return this.paymentRepository.create(paymentData);
  }
}