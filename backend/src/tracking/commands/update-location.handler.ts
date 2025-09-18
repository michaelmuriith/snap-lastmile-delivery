import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { UpdateLocationCommand } from './update-location.command';
import { TrackingData } from '../entities/tracking.entity';
import { TrackingRepository } from '../repositories/tracking.repository';

@CommandHandler(UpdateLocationCommand)
export class UpdateLocationHandler implements ICommandHandler<UpdateLocationCommand> {
  constructor(
    @Inject('TrackingRepository')
    private readonly trackingRepository: TrackingRepository,
  ) {}

  async execute(command: UpdateLocationCommand): Promise<TrackingData> {
    const { trackingData } = command;

    return this.trackingRepository.create(trackingData);
  }
}