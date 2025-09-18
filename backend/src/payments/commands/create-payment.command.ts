import { CreatePaymentData } from '../entities/payment.entity';

export class CreatePaymentCommand {
  constructor(public readonly paymentData: CreatePaymentData) {}
}

export class UpdatePaymentStatusCommand {
  constructor(
    public readonly paymentId: string,
    public readonly status: string,
    public readonly transactionId?: string,
    public readonly metadata?: Record<string, any>,
  ) {}
}