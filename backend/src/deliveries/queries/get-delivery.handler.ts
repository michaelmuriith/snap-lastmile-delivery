import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetDeliveryQuery, GetDeliveriesQuery } from './get-delivery.query';
import { Delivery } from '../entities/delivery.entity';
import { DeliveryRepository } from '../repositories/delivery.repository';

@QueryHandler(GetDeliveryQuery)
export class GetDeliveryHandler implements IQueryHandler<GetDeliveryQuery> {
  constructor(
    @Inject('DeliveryRepository')
    private readonly deliveryRepository: DeliveryRepository,
  ) {}

  async execute(query: GetDeliveryQuery): Promise<Delivery | null> {
    return this.deliveryRepository.findById(query.id);
  }
}

@QueryHandler(GetDeliveriesQuery)
export class GetDeliveriesHandler implements IQueryHandler<GetDeliveriesQuery> {
  constructor(
    @Inject('DeliveryRepository')
    private readonly deliveryRepository: DeliveryRepository,
  ) {}

  async execute(query: GetDeliveriesQuery): Promise<{ deliveries: Delivery[]; total: number }> {
    if (query.customerId) {
      return this.deliveryRepository.findByCustomerId(query.customerId, query.page, query.limit);
    }

    if (query.driverId) {
      return this.deliveryRepository.findByDriverId(query.driverId, query.page, query.limit);
    }

    return this.deliveryRepository.findAll(query.page, query.limit, query.status);
  }
}