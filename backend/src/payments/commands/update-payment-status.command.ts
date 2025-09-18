import { PaymentStatus } from '../entities/payment.entity';

export class UpdatePaymentStatusCommand {
  constructor(
    public readonly paymentId: string,
    public readonly status: PaymentStatus,
    public readonly transactionId?: string,
    public readonly metadata?: Record<string, any>,
  ) {}
}