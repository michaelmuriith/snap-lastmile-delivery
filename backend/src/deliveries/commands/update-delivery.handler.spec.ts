import { Test, TestingModule } from '@nestjs/testing';
import { UpdateDeliveryHandler, AssignDriverHandler, UpdateDeliveryStatusHandler } from './update-delivery.handler';
import { UpdateDeliveryCommand, AssignDriverCommand, UpdateDeliveryStatusCommand } from './update-delivery.command';
import { DeliveryRepository } from '../repositories/delivery.repository';
import { Delivery } from '../entities/delivery.entity';

describe('UpdateDeliveryHandlers', () => {
  let updateDeliveryHandler: UpdateDeliveryHandler;
  let assignDriverHandler: AssignDriverHandler;
  let updateStatusHandler: UpdateDeliveryStatusHandler;
  let repository: DeliveryRepository;

  const mockRepository = {
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateDeliveryHandler,
        AssignDriverHandler,
        UpdateDeliveryStatusHandler,
        {
          provide: 'DeliveryRepository',
          useValue: mockRepository,
        },
      ],
    }).compile();

    updateDeliveryHandler = module.get<UpdateDeliveryHandler>(UpdateDeliveryHandler);
    assignDriverHandler = module.get<AssignDriverHandler>(AssignDriverHandler);
    updateStatusHandler = module.get<UpdateDeliveryStatusHandler>(UpdateDeliveryStatusHandler);
    repository = module.get('DeliveryRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('UpdateDeliveryHandler', () => {
    it('should be defined', () => {
      expect(updateDeliveryHandler).toBeDefined();
    });

    describe('execute', () => {
      it('should update delivery successfully', async () => {
        const updateData = {
          status: 'picked_up' as const,
          estimatedDeliveryTime: new Date('2025-01-01T14:00:00Z'),
        };

        const command = new UpdateDeliveryCommand('delivery-123', updateData);

        const expectedDelivery: Delivery = {
          id: 'delivery-123',
          customerId: 'customer-123',
          type: 'send',
          pickupAddress: '123 Main St',
          deliveryAddress: '456 Oak Ave',
          packageDescription: 'Test package',
          status: 'picked_up',
          estimatedDeliveryTime: new Date('2025-01-01T14:00:00Z'),
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        mockRepository.update.mockResolvedValue(expectedDelivery);

        const result = await updateDeliveryHandler.execute(command);

        expect(mockRepository.update).toHaveBeenCalledWith('delivery-123', updateData);
        expect(mockRepository.update).toHaveBeenCalledTimes(1);
        expect(result).toEqual(expectedDelivery);
      });

      it('should handle null result when delivery not found', async () => {
        const updateData = { status: 'cancelled' as const };
        const command = new UpdateDeliveryCommand('non-existent-id', updateData);

        mockRepository.update.mockResolvedValue(null);

        const result = await updateDeliveryHandler.execute(command);

        expect(mockRepository.update).toHaveBeenCalledWith('non-existent-id', updateData);
        expect(result).toBeNull();
      });

      it('should handle multiple field updates', async () => {
        const updateData = {
          driverId: 'driver-456',
          status: 'in_transit' as const,
          actualDeliveryTime: new Date(),
        };

        const command = new UpdateDeliveryCommand('delivery-789', updateData);

        const expectedDelivery: Delivery = {
          id: 'delivery-789',
          customerId: 'customer-123',
          driverId: 'driver-456',
          type: 'send',
          pickupAddress: '123 Main St',
          deliveryAddress: '456 Oak Ave',
          packageDescription: 'Test package',
          status: 'in_transit',
          actualDeliveryTime: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        mockRepository.update.mockResolvedValue(expectedDelivery);

        const result = await updateDeliveryHandler.execute(command);

        expect(mockRepository.update).toHaveBeenCalledWith('delivery-789', updateData);
        expect(result?.driverId).toBe('driver-456');
        expect(result?.status).toBe('in_transit');
        expect(result?.actualDeliveryTime).toBeDefined();
      });
    });
  });

  describe('AssignDriverHandler', () => {
    it('should be defined', () => {
      expect(assignDriverHandler).toBeDefined();
    });

    describe('execute', () => {
      it('should assign driver and update status to assigned', async () => {
        const command = new AssignDriverCommand('delivery-123', 'driver-456');

        const expectedDelivery: Delivery = {
          id: 'delivery-123',
          customerId: 'customer-123',
          driverId: 'driver-456',
          type: 'send',
          pickupAddress: '123 Main St',
          deliveryAddress: '456 Oak Ave',
          packageDescription: 'Test package',
          status: 'assigned',
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        mockRepository.update.mockResolvedValue(expectedDelivery);

        const result = await assignDriverHandler.execute(command);

        expect(mockRepository.update).toHaveBeenCalledWith('delivery-123', {
          driverId: 'driver-456',
          status: 'assigned',
        });
        expect(mockRepository.update).toHaveBeenCalledTimes(1);
        expect(result?.driverId).toBe('driver-456');
        expect(result?.status).toBe('assigned');
      });

      it('should handle delivery not found', async () => {
        const command = new AssignDriverCommand('non-existent-id', 'driver-456');

        mockRepository.update.mockResolvedValue(null);

        const result = await assignDriverHandler.execute(command);

        expect(mockRepository.update).toHaveBeenCalledWith('non-existent-id', {
          driverId: 'driver-456',
          status: 'assigned',
        });
        expect(result).toBeNull();
      });

      it('should handle repository errors', async () => {
        const command = new AssignDriverCommand('delivery-123', 'driver-456');

        const error = new Error('Database connection failed');
        mockRepository.update.mockRejectedValue(error);

        await expect(assignDriverHandler.execute(command)).rejects.toThrow('Database connection failed');
        expect(mockRepository.update).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('UpdateDeliveryStatusHandler', () => {
    it('should be defined', () => {
      expect(updateStatusHandler).toBeDefined();
    });

    describe('execute', () => {
      it('should update delivery status successfully', async () => {
        const command = new UpdateDeliveryStatusCommand(
          'delivery-123',
          'picked_up',
          new Date('2025-01-01T10:30:00Z'),
          undefined
        );

        const expectedDelivery: Delivery = {
          id: 'delivery-123',
          customerId: 'customer-123',
          type: 'send',
          pickupAddress: '123 Main St',
          deliveryAddress: '456 Oak Ave',
          packageDescription: 'Test package',
          status: 'picked_up',
          estimatedDeliveryTime: new Date('2025-01-01T10:30:00Z'),
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        mockRepository.update.mockResolvedValue(expectedDelivery);

        const result = await updateStatusHandler.execute(command);

        expect(mockRepository.update).toHaveBeenCalledWith('delivery-123', {
          status: 'picked_up',
          estimatedDeliveryTime: new Date('2025-01-01T10:30:00Z'),
          actualDeliveryTime: undefined,
        });
        expect(result?.status).toBe('picked_up');
        expect(result?.estimatedDeliveryTime).toEqual(new Date('2025-01-01T10:30:00Z'));
      });

      it('should handle delivery completion with actual delivery time', async () => {
        const actualDeliveryTime = new Date();
        const command = new UpdateDeliveryStatusCommand(
          'delivery-456',
          'delivered',
          undefined,
          actualDeliveryTime
        );

        const expectedDelivery: Delivery = {
          id: 'delivery-456',
          customerId: 'customer-123',
          type: 'send',
          pickupAddress: '123 Main St',
          deliveryAddress: '456 Oak Ave',
          packageDescription: 'Test package',
          status: 'delivered',
          actualDeliveryTime,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        mockRepository.update.mockResolvedValue(expectedDelivery);

        const result = await updateStatusHandler.execute(command);

        expect(mockRepository.update).toHaveBeenCalledWith('delivery-456', {
          status: 'delivered',
          estimatedDeliveryTime: undefined,
          actualDeliveryTime,
        });
        expect(result?.status).toBe('delivered');
        expect(result?.actualDeliveryTime).toBe(actualDeliveryTime);
      });

      it('should handle status update without timestamps', async () => {
        const command = new UpdateDeliveryStatusCommand(
          'delivery-789',
          'in_transit',
          undefined,
          undefined
        );

        const expectedDelivery: Delivery = {
          id: 'delivery-789',
          customerId: 'customer-123',
          type: 'send',
          pickupAddress: '123 Main St',
          deliveryAddress: '456 Oak Ave',
          packageDescription: 'Test package',
          status: 'in_transit',
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        mockRepository.update.mockResolvedValue(expectedDelivery);

        const result = await updateStatusHandler.execute(command);

        expect(mockRepository.update).toHaveBeenCalledWith('delivery-789', {
          status: 'in_transit',
          estimatedDeliveryTime: undefined,
          actualDeliveryTime: undefined,
        });
        expect(result?.status).toBe('in_transit');
      });

      it('should handle delivery not found', async () => {
        const command = new UpdateDeliveryStatusCommand(
          'non-existent-id',
          'cancelled',
          undefined,
          undefined
        );

        mockRepository.update.mockResolvedValue(null);

        const result = await updateStatusHandler.execute(command);

        expect(result).toBeNull();
      });
    });
  });
});