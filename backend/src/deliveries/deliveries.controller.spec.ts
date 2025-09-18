import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { DeliveriesController } from './deliveries.controller';
import { CreateDeliveryCommand } from './commands/create-delivery.command';
import { UpdateDeliveryCommand, AssignDriverCommand, UpdateDeliveryStatusCommand } from './commands/update-delivery.command';
import { GetDeliveryQuery, GetDeliveriesQuery } from './queries/get-delivery.query';
import { Delivery } from './entities/delivery.entity';
import { DeliveryTypeEnum } from './dto/create-delivery.dto';

describe('DeliveriesController', () => {
  let controller: DeliveriesController;
  let commandBus: CommandBus;
  let queryBus: QueryBus;

  const mockCommandBus = {
    execute: jest.fn(),
  };

  const mockQueryBus = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeliveriesController],
      providers: [
        {
          provide: CommandBus,
          useValue: mockCommandBus,
        },
        {
          provide: QueryBus,
          useValue: mockQueryBus,
        },
      ],
    }).compile();

    controller = module.get<DeliveriesController>(DeliveriesController);
    commandBus = module.get<CommandBus>(CommandBus);
    queryBus = module.get<QueryBus>(QueryBus);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createDelivery', () => {
    it('should create a delivery and return it', async () => {
      const createDeliveryDto = {
        customerId: 'customer-123',
        type: DeliveryTypeEnum.SEND,
        pickupAddress: '123 Main St',
        deliveryAddress: '456 Oak Ave',
        packageDescription: 'Test package',
        pickupLatitude: 40.7128,
        pickupLongitude: -74.0060,
        deliveryLatitude: 34.0522,
        deliveryLongitude: -118.2437,
        packageValue: 100.50,
        recipientName: 'John Doe',
        recipientPhone: '+1234567890',
      };

      const expectedDelivery: Delivery = {
        id: 'delivery-123',
        customerId: 'customer-123',
        type: 'send',
        pickupAddress: '123 Main St',
        deliveryAddress: '456 Oak Ave',
        packageDescription: 'Test package',
        pickupLatitude: 40.7128,
        pickupLongitude: -74.0060,
        deliveryLatitude: 34.0522,
        deliveryLongitude: -118.2437,
        packageValue: 100.50,
        recipientName: 'John Doe',
        recipientPhone: '+1234567890',
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockCommandBus.execute.mockResolvedValue(expectedDelivery);

      const result = await controller.createDelivery(createDeliveryDto);

      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(CreateDeliveryCommand)
      );
      expect(result).toEqual(expectedDelivery);
    });

    it('should handle minimal delivery data', async () => {
      const createDeliveryDto = {
        customerId: 'customer-456',
        type: DeliveryTypeEnum.RECEIVE,
        pickupAddress: '789 Pine St',
        deliveryAddress: '321 Elm St',
        packageDescription: 'Simple package',
      };

      const expectedDelivery: Delivery = {
        id: 'delivery-456',
        customerId: 'customer-456',
        type: 'receive',
        pickupAddress: '789 Pine St',
        deliveryAddress: '321 Elm St',
        packageDescription: 'Simple package',
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockCommandBus.execute.mockResolvedValue(expectedDelivery);

      const result = await controller.createDelivery(createDeliveryDto);

      expect(result).toEqual(expectedDelivery);
    });
  });

  describe('getDelivery', () => {
    it('should return a delivery by ID', async () => {
      const deliveryId = 'delivery-123';
      const expectedDelivery: Delivery = {
        id: deliveryId,
        customerId: 'customer-123',
        type: 'send',
        pickupAddress: '123 Main St',
        deliveryAddress: '456 Oak Ave',
        packageDescription: 'Test package',
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockQueryBus.execute.mockResolvedValue(expectedDelivery);

      const result = await controller.getDelivery(deliveryId);

      expect(mockQueryBus.execute).toHaveBeenCalledWith(
        expect.any(GetDeliveryQuery)
      );
      expect(result).toEqual(expectedDelivery);
    });

    it('should return null when delivery not found', async () => {
      const deliveryId = 'non-existent-id';

      mockQueryBus.execute.mockResolvedValue(null);

      const result = await controller.getDelivery(deliveryId);

      expect(result).toBeNull();
    });
  });

  describe('getDeliveries', () => {
    it('should return deliveries with customer filter', async () => {
      const customerId = 'customer-123';
      const expectedResult = {
        deliveries: [
          {
            id: 'delivery-1',
            customerId,
            type: 'send',
            pickupAddress: '123 Main St',
            deliveryAddress: '456 Oak Ave',
            packageDescription: 'Package 1',
            status: 'pending',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        total: 1,
      };

      mockQueryBus.execute.mockResolvedValue(expectedResult);

      const result = await controller.getDeliveries(customerId, undefined, undefined, '1', '10');

      expect(mockQueryBus.execute).toHaveBeenCalledWith(
        expect.any(GetDeliveriesQuery)
      );
      expect(result).toEqual(expectedResult);
    });

    it('should return deliveries with driver filter', async () => {
      const driverId = 'driver-456';
      const expectedResult = {
        deliveries: [
          {
            id: 'delivery-2',
            customerId: 'customer-123',
            driverId,
            type: 'send',
            pickupAddress: '123 Main St',
            deliveryAddress: '456 Oak Ave',
            packageDescription: 'Package 2',
            status: 'assigned',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        total: 1,
      };

      mockQueryBus.execute.mockResolvedValue(expectedResult);

      const result = await controller.getDeliveries(undefined, driverId, undefined, '1', '10');

      expect(result).toEqual(expectedResult);
    });

    it('should return deliveries with status filter', async () => {
      const status = 'pending';
      const expectedResult = {
        deliveries: [
          {
            id: 'delivery-3',
            customerId: 'customer-123',
            type: 'receive',
            pickupAddress: '789 Pine St',
            deliveryAddress: '321 Elm St',
            packageDescription: 'Package 3',
            status: 'pending',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        total: 1,
      };

      mockQueryBus.execute.mockResolvedValue(expectedResult);

      const result = await controller.getDeliveries(undefined, undefined, status, '1', '10');

      expect(result).toEqual(expectedResult);
    });

    it('should handle pagination parameters', async () => {
      const expectedResult = {
        deliveries: [],
        total: 0,
      };

      mockQueryBus.execute.mockResolvedValue(expectedResult);

      const result = await controller.getDeliveries(undefined, undefined, undefined, '2', '20');

      expect(result).toEqual(expectedResult);
    });

    it('should handle undefined pagination parameters', async () => {
      const expectedResult = {
        deliveries: [],
        total: 0,
      };

      mockQueryBus.execute.mockResolvedValue(expectedResult);

      const result = await controller.getDeliveries();

      expect(result).toEqual(expectedResult);
    });
  });

  describe('assignDriver', () => {
    it('should assign driver to delivery', async () => {
      const deliveryId = 'delivery-123';
      const driverId = 'driver-456';

      const expectedDelivery: Delivery = {
        id: deliveryId,
        customerId: 'customer-123',
        driverId,
        type: 'send',
        pickupAddress: '123 Main St',
        deliveryAddress: '456 Oak Ave',
        packageDescription: 'Test package',
        status: 'assigned',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockCommandBus.execute.mockResolvedValue(expectedDelivery);

      const result = await controller.assignDriver(deliveryId, driverId);

      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(AssignDriverCommand)
      );
      expect(result).toEqual(expectedDelivery);
    });

    it('should return null when delivery not found', async () => {
      const deliveryId = 'non-existent-id';
      const driverId = 'driver-456';

      mockCommandBus.execute.mockResolvedValue(null);

      const result = await controller.assignDriver(deliveryId, driverId);

      expect(result).toBeNull();
    });
  });

  describe('updateDeliveryStatus', () => {
    it('should update delivery status successfully', async () => {
      const deliveryId = 'delivery-123';
      const status = 'picked_up';
      const estimatedDeliveryTime = new Date('2025-01-01T14:00:00Z');

      const expectedDelivery: Delivery = {
        id: deliveryId,
        customerId: 'customer-123',
        type: 'send',
        pickupAddress: '123 Main St',
        deliveryAddress: '456 Oak Ave',
        packageDescription: 'Test package',
        status: 'picked_up',
        estimatedDeliveryTime,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockCommandBus.execute.mockResolvedValue(expectedDelivery);

      const result = await controller.updateDeliveryStatus(
        deliveryId,
        status,
        estimatedDeliveryTime,
        undefined
      );

      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(UpdateDeliveryStatusCommand)
      );
      expect(result).toEqual(expectedDelivery);
    });

    it('should handle delivery completion', async () => {
      const deliveryId = 'delivery-456';
      const status = 'delivered';
      const actualDeliveryTime = new Date();

      const expectedDelivery: Delivery = {
        id: deliveryId,
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

      mockCommandBus.execute.mockResolvedValue(expectedDelivery);

      const result = await controller.updateDeliveryStatus(
        deliveryId,
        status,
        undefined,
        actualDeliveryTime
      );

      expect(result?.status).toBe('delivered');
      expect(result?.actualDeliveryTime).toBe(actualDeliveryTime);
    });

    it('should handle status update without timestamps', async () => {
      const deliveryId = 'delivery-789';
      const status = 'in_transit';

      const expectedDelivery: Delivery = {
        id: deliveryId,
        customerId: 'customer-123',
        type: 'send',
        pickupAddress: '123 Main St',
        deliveryAddress: '456 Oak Ave',
        packageDescription: 'Test package',
        status: 'in_transit',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockCommandBus.execute.mockResolvedValue(expectedDelivery);

      const result = await controller.updateDeliveryStatus(
        deliveryId,
        status,
        undefined,
        undefined
      );

      expect(result?.status).toBe('in_transit');
    });
  });
});