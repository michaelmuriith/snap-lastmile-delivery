import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DatabaseModule } from '../database/database.module';
import { DeliveryRepository } from './repositories/delivery.repository';
import { CreateDeliveryHandler } from './commands/create-delivery.handler';
import { UpdateDeliveryHandler, AssignDriverHandler, UpdateDeliveryStatusHandler } from './commands/update-delivery.handler';
import { GetDeliveryHandler, GetDeliveriesHandler } from './queries/get-delivery.handler';
import { DeliveriesController } from './deliveries.controller';

@Module({
  imports: [CqrsModule, DatabaseModule],
  controllers: [DeliveriesController],
  providers: [
    {
      provide: 'DeliveryRepository',
      useClass: DeliveryRepository,
    },
    // Command Handlers
    CreateDeliveryHandler,
    UpdateDeliveryHandler,
    AssignDriverHandler,
    UpdateDeliveryStatusHandler,
    // Query Handlers
    GetDeliveryHandler,
    GetDeliveriesHandler,
  ],
  exports: ['DeliveryRepository'],
})
export class DeliveriesModule {}
