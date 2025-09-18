import { ICommandHandler } from '@nestjs/cqrs';
import { UpdateLocationCommand } from './update-location.command';
import { TrackingData } from '../entities/tracking.entity';
import { TrackingRepository } from '../repositories/tracking.repository';
export declare class UpdateLocationHandler implements ICommandHandler<UpdateLocationCommand> {
    private readonly trackingRepository;
    constructor(trackingRepository: TrackingRepository);
    execute(command: UpdateLocationCommand): Promise<TrackingData>;
}
