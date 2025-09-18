import { ICommandHandler } from '@nestjs/cqrs';
import { CreatePaymentCommand } from './create-payment.command';
import { Payment } from '../entities/payment.entity';
import { PaymentRepository } from '../repositories/payment.repository';
export declare class CreatePaymentHandler implements ICommandHandler<CreatePaymentCommand> {
    private readonly paymentRepository;
    constructor(paymentRepository: PaymentRepository);
    execute(command: CreatePaymentCommand): Promise<Payment>;
}
