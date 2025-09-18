import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetPaymentQuery, GetPaymentsQuery } from './get-payment.query';
import { Payment } from '../entities/payment.entity';
import { PaymentRepository } from '../repositories/payment.repository';

@QueryHandler(GetPaymentQuery)
export class GetPaymentHandler implements IQueryHandler<GetPaymentQuery> {
  constructor(
    @Inject('PaymentRepository')
    private readonly paymentRepository: PaymentRepository,
  ) {}

  async execute(query: GetPaymentQuery): Promise<Payment | null> {
    return this.paymentRepository.findById(query.id);
  }
}

@QueryHandler(GetPaymentsQuery)
export class GetPaymentsHandler implements IQueryHandler<GetPaymentsQuery> {
  constructor(
    @Inject('PaymentRepository')
    private readonly paymentRepository: PaymentRepository,
  ) {}

  async execute(query: GetPaymentsQuery): Promise<{ payments: Payment[]; total: number }> {
    return this.paymentRepository.findAll(
      query.page,
      query.limit,
      query.status,
    );
  }
}