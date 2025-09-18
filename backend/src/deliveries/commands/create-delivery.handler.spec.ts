import { Test, TestingModule } from '@nestjs/testing';
import { CreateDeliveryHandler } from './create-delivery.handler';
import { CreateDeliveryCommand } from './create-delivery.command';
import { DeliveryRepository } from '../repositories/delivery.repository';
import { Delivery } from '../entities/delivery.entity';

describe('CreateDeliveryHandler', () => {
  let handler: CreateDeliveryHandler;
  let repository: DeliveryRepository;

  const mockRepository = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateDeliveryHandler,
        {
          provide: 'DeliveryRepository',
          useValue: mockRepository,
        },
      ],
    }).compile();

    handler = module.get<CreateDeliveryHandler>(CreateDeliveryHandler);
    repository = module.get('DeliveryRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  describe('execute', () => {
    it('should create a delivery successfully', async () => {
      const command = new CreateDeliveryCommand({
        customerId: 'customer-123',
        type: 'send',
        pickupAddress: '123 Main St',
        deliveryAddress: '456 Oak Ave',
        packageDescription: 'Test package',
      });

      const expectedDelivery: Delivery = {
        id: 'delivery-123',
        customerId: 'customer-123',
        type: 'send',
        pickupAddress: '123 Main St',
        deliveryAddress: '456 Oak Ave',
        packageDescription: 'Test package',
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.create.mockResolvedValue(expectedDelivery);

      const result = await handler.execute(command);

      expect(mockRepository.create).toHaveBeenCalledWith(command.deliveryData);
      expect(mockRepository.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedDelivery);
    });

    it('should handle delivery creation with optional fields', async () => {
      const command = new CreateDeliveryCommand({
        customerId: 'customer-456',
        type: 'receive',
        pickupAddress: '789 Pine St',
        deliveryAddress: '321 Elm St',
        packageDescription: 'Fragile package',
        pickupLatitude: 40.7128,
        pickupLongitude: -74.0060,
        deliveryLatitude: 34.0522,
        deliveryLongitude: -118.2437,
        packageValue: 150.00,
        recipientName: 'Jane Smith',
        recipientPhone: '+1987654321',
      });

      const expectedDelivery: Delivery = {
        id: 'delivery-456',
        customerId: 'customer-456',
        type: 'receive',
        pickupAddress: '789 Pine St',
        deliveryAddress: '321 Elm St',
        packageDescription: 'Fragile package',
        pickupLatitude: 40.7128,
        pickupLongitude: -74.0060,
        deliveryLatitude: 34.0522,
        deliveryLongitude: -118.2437,
        packageValue: 150.00,
        recipientName: 'Jane Smith',
        recipientPhone: '+1987654321',
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.create.mockResolvedValue(expectedDelivery);

      const result = await handler.execute(command);

      expect(mockRepository.create).toHaveBeenCalledWith(command.deliveryData);
      expect(result).toEqual(expectedDelivery);
      expect(result.pickupLatitude).toBe(40.7128);
      expect(result.packageValue).toBe(150.00);
    });

    it('should propagate repository errors', async () => {
      const command = new CreateDeliveryCommand({
        customerId: 'customer-123',
        type: 'send',
        pickupAddress: '123 Main St',
        deliveryAddress: '456 Oak Ave',
        packageDescription: 'Test package',
      });

      const error = new Error('Database connection failed');
      mockRepository.create.mockRejectedValue(error);

      await expect(handler.execute(command)).rejects.toThrow('Database connection failed');
      expect(mockRepository.create).toHaveBeenCalledTimes(1);
    });

    it('should call repository with correct data structure', async () => {
      const deliveryData = {
        customerId: 'customer-789',
        type: 'store_pickup' as const,
        pickupAddress: 'Store Location',
        deliveryAddress: 'Customer Home',
        packageDescription: 'Store pickup order',
      };

      const command = new CreateDeliveryCommand(deliveryData);

      mockRepository.create.mockResolvedValue({
        id: 'delivery-789',
        ...deliveryData,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await handler.execute(command);

      expect(mockRepository.create).toHaveBeenCalledWith(deliveryData);
      expect(mockRepository.create).toHaveBeenCalledTimes(1);
    });
  });
});