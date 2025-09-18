import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from '../database/database.module';
import { TrackingGateway } from './tracking.gateway';
import { TrackingRepository } from './repositories/tracking.repository';
import { UpdateLocationHandler } from './commands/update-location.handler';

@Module({
  imports: [CqrsModule, DatabaseModule, JwtModule],
  providers: [
    TrackingGateway,
    {
      provide: 'TrackingRepository',
      useClass: TrackingRepository,
    },
    UpdateLocationHandler,
  ],
  exports: ['TrackingRepository', TrackingGateway],
})
export class TrackingModule {}