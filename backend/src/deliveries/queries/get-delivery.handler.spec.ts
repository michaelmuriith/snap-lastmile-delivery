import { Test, TestingModule } from '@nestjs/testing';
import { GetDeliveryHandler, GetDeliveriesHandler } from './get-delivery.handler';
import { GetDeliveryQuery, GetDeliveriesQuery } from './get-delivery.query';
import { DeliveryRepository } from '../repositories/delivery.repository';
import { Delivery } from '../entities/delivery.entity';

describe('GetDeliveryHandler', () => {
  let getDeliveryHandler: GetDeliveryHandler;
  let getDeliveriesHandler: GetDeliveriesHandler;
  let repository: DeliveryRepository;

  const mockRepository = {
    findById: jest.fn(),
    findByCustomerId: jest.fn(),
    findByDriverId: jest.fn(),
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetDeliveryHandler,
        GetDeliveriesHandler,
        {
          provide: 'DeliveryRepository',
          useValue: mockRepository,
        },
      ],
    }).compile();

    getDeliveryHandler = module.get<GetDeliveryHandler>(GetDeliveryHandler);
    getDeliveriesHandler = module.get<GetDeliveriesHandler>(GetDeliveriesHandler);
    repository = module.get('DeliveryRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GetDeliveryHandler', () => {
    it('should be defined', () => {
      expect(getDeliveryHandler).toBeDefined();
    });

    describe('execute', () => {
      it('should return delivery when found', async () => {
        const deliveryId = 'delivery-123';
        const query = new GetDeliveryQuery(deliveryId);

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

        mockRepository.findById.mockResolvedValue(expectedDelivery);

        const result = await getDeliveryHandler.execute(query);

        expect(mockRepository.findById).toHaveBeenCalledWith(deliveryId);
        expect(mockRepository.findById).toHaveBeenCalledTimes(1);
        expect(result).toEqual(expectedDelivery);
      });

      it('should return null when delivery not found', async () => {
        const deliveryId = 'non-existent-id';
        const query = new GetDeliveryQuery(deliveryId);

        mockRepository.findById.mockResolvedValue(null);

        const result = await getDeliveryHandler.execute(query);

        expect(mockRepository.findById).toHaveBeenCalledWith(deliveryId);
        expect(result).toBeNull();
      });

      it('should handle repository errors', async () => {
        const deliveryId = 'delivery-123';
        const query = new GetDeliveryQuery(deliveryId);

        const error = new Error('Database connection failed');
        mockRepository.findById.mockRejectedValue(error);

        await expect(getDeliveryHandler.execute(query)).rejects.toThrow('Database connection failed');
        expect(mockRepository.findById).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('GetDeliveriesHandler', () => {
    it('should be defined', () => {
      expect(getDeliveriesHandler).toBeDefined();
    });

    describe('execute', () => {
      it('should call findByCustomerId when customerId is provided', async () => {
        const query = new GetDeliveriesQuery('customer-123', undefined, undefined, 1, 10);
        const expectedResult = {
          deliveries: [
            {
              id: 'delivery-1',
              customerId: 'customer-123',
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

        mockRepository.findByCustomerId.mockResolvedValue(expectedResult);

        const result = await getDeliveriesHandler.execute(query);

        expect(mockRepository.findByCustomerId).toHaveBeenCalledWith('customer-123', 1, 10);
        expect(mockRepository.findByCustomerId).toHaveBeenCalledTimes(1);
        expect(result).toEqual(expectedResult);
      });

      it('should call findByDriverId when driverId is provided', async () => {
        const query = new GetDeliveriesQuery(undefined, 'driver-456', undefined, 1, 10);
        const expectedResult = {
          deliveries: [
            {
              id: 'delivery-2',
              customerId: 'customer-123',
              driverId: 'driver-456',
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

        mockRepository.findByDriverId.mockResolvedValue(expectedResult);

        const result = await getDeliveriesHandler.execute(query);

        expect(mockRepository.findByDriverId).toHaveBeenCalledWith('driver-456', 1, 10);
        expect(mockRepository.findByDriverId).toHaveBeenCalledTimes(1);
        expect(result).toEqual(expectedResult);
      });

      it('should call findAll when neither customerId nor driverId is provided', async () => {
        const query = new GetDeliveriesQuery(undefined, undefined, 'pending', 2, 20);
        const expectedResult = {
          deliveries: [
            {
              id: 'delivery-3',
              customerId: 'customer-789',
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

        mockRepository.findAll.mockResolvedValue(expectedResult);

        const result = await getDeliveriesHandler.execute(query);

        expect(mockRepository.findAll).toHaveBeenCalledWith(2, 20, 'pending');
        expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
        expect(result).toEqual(expectedResult);
      });

      it('should prioritize customerId over driverId', async () => {
        const query = new GetDeliveriesQuery('customer-123', 'driver-456', undefined, 1, 10);
        const expectedResult = {
          deliveries: [],
          total: 0,
        };

        mockRepository.findByCustomerId.mockResolvedValue(expectedResult);

        const result = await getDeliveriesHandler.execute(query);

        expect(mockRepository.findByCustomerId).toHaveBeenCalledWith('customer-123', 1, 10);
        expect(mockRepository.findByCustomerId).toHaveBeenCalledTimes(1);
        expect(mockRepository.findByDriverId).not.toHaveBeenCalled();
        expect(mockRepository.findAll).not.toHaveBeenCalled();
        expect(result).toEqual(expectedResult);
      });

      it('should handle default pagination values', async () => {
        const query = new GetDeliveriesQuery();
        const expectedResult = {
          deliveries: [],
          total: 0,
        };

        mockRepository.findAll.mockResolvedValue(expectedResult);

        const result = await getDeliveriesHandler.execute(query);

        expect(mockRepository.findAll).toHaveBeenCalledWith(1, 10, undefined);
        expect(result).toEqual(expectedResult);
      });

      it('should propagate repository errors', async () => {
        const query = new GetDeliveriesQuery('customer-123');

        const error = new Error('Database connection failed');
        mockRepository.findByCustomerId.mockRejectedValue(error);

        await expect(getDeliveriesHandler.execute(query)).rejects.toThrow('Database connection failed');
        expect(mockRepository.findByCustomerId).toHaveBeenCalledTimes(1);
      });
    });
  });
});