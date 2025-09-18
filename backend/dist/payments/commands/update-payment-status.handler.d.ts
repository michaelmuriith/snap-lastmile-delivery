import { ICommandHandler } from '@nestjs/cqrs';
import { UpdatePaymentStatusCommand } from './update-payment-status.command';
import { Payment } from '../entities/payment.entity';
import { PaymentRepository } from '../repositories/payment.repository';
export declare class UpdatePaymentStatusHandler implements ICommandHandler<UpdatePaymentStatusCommand> {
    private readonly paymentRepository;
    constructor(paymentRepository: PaymentRepository);
    execute(command: UpdatePaymentStatusCommand): Promise<Payment | null>;
}
