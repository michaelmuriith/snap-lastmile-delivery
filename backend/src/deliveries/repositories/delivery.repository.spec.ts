import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryRepository } from './delivery.repository';
import { DatabaseService } from '../../database/connection/database.service';
import { Delivery, CreateDeliveryData } from '../entities/delivery.entity';

describe('DeliveryRepository', () => {
  let repository: DeliveryRepository;
  let databaseService: DatabaseService;

  const mockDatabaseService = {
    query: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeliveryRepository,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    repository = module.get<DeliveryRepository>(DeliveryRepository);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a delivery successfully', async () => {
      const createData: CreateDeliveryData = {
        customerId: 'customer-123',
        type: 'send',
        pickupAddress: '123 Main St',
        deliveryAddress: '456 Oak Ave',
        packageDescription: 'Test package',
      };

      const mockResult = {
        rows: [{
          id: 'delivery-123',
          customer_id: 'customer-123',
          driver_id: null,
          type: 'send',
          pickup_address: '123 Main St',
          delivery_address: '456 Oak Ave',
          package_description: 'Test package',
          status: 'pending',
          created_at: new Date(),
          updated_at: new Date(),
        }],
      };

      mockDatabaseService.query.mockResolvedValue(mockResult);

      const result = await repository.create(createData);

      expect(mockDatabaseService.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO deliveries'),
        expect.any(Array)
      );
      expect(result).toBeDefined();
      expect(result.id).toBe('delivery-123');
      expect(result.customerId).toBe('customer-123');
    });

    it('should handle optional fields correctly', async () => {
      const createData: CreateDeliveryData = {
        customerId: 'customer-123',
        type: 'receive',
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

      const mockResult = {
        rows: [{
          id: 'delivery-456',
          customer_id: 'customer-123',
          type: 'receive',
          pickup_address: '123 Main St',
          delivery_address: '456 Oak Ave',
          package_description: 'Test package',
          pickup_latitude: 40.7128,
          pickup_longitude: -74.0060,
          delivery_latitude: 34.0522,
          delivery_longitude: -118.2437,
          package_value: 100.50,
          recipient_name: 'John Doe',
          recipient_phone: '+1234567890',
          status: 'pending',
          created_at: new Date(),
          updated_at: new Date(),
        }],
      };

      mockDatabaseService.query.mockResolvedValue(mockResult);

      const result = await repository.create(createData);

      expect(result.pickupLatitude).toBe(40.7128);
      expect(result.packageValue).toBe(100.50);
      expect(result.recipientName).toBe('John Doe');
    });
  });

  describe('findById', () => {
    it('should return delivery when found', async () => {
      const mockResult = {
        rows: [{
          id: 'delivery-123',
          customer_id: 'customer-123',
          type: 'send',
          pickup_address: '123 Main St',
          delivery_address: '456 Oak Ave',
          package_description: 'Test package',
          status: 'pending',
          created_at: new Date(),
          updated_at: new Date(),
        }],
      };

      mockDatabaseService.query.mockResolvedValue(mockResult);

      const result = await repository.findById('delivery-123');

      expect(mockDatabaseService.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT'),
        ['delivery-123']
      );
      expect(result).toBeDefined();
      expect(result?.id).toBe('delivery-123');
    });

    it('should return null when delivery not found', async () => {
      const mockResult = { rows: [] };
      mockDatabaseService.query.mockResolvedValue(mockResult);

      const result = await repository.findById('non-existent-id');

      expect(result).toBeNull();
    });
  });

  describe('findByCustomerId', () => {
    it('should return deliveries for customer with pagination', async () => {
      const mockCountResult = { rows: [{ total: '5' }] };
      const mockDataResult = {
        rows: [
          {
            id: 'delivery-1',
            customer_id: 'customer-123',
            type: 'send',
            pickup_address: '123 Main St',
            delivery_address: '456 Oak Ave',
            package_description: 'Package 1',
            status: 'pending',
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: 'delivery-2',
            customer_id: 'customer-123',
            type: 'receive',
            pickup_address: '789 Pine St',
            delivery_address: '321 Elm St',
            package_description: 'Package 2',
            status: 'delivered',
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
      };

      mockDatabaseService.query
        .mockResolvedValueOnce(mockCountResult)
        .mockResolvedValueOnce(mockDataResult);

      const result = await repository.findByCustomerId('customer-123', 1, 10);

      expect(result.deliveries).toHaveLength(2);
      expect(result.total).toBe(5);
      expect(mockDatabaseService.query).toHaveBeenCalledTimes(2);
    });
  });

  describe('update', () => {
    it('should update delivery successfully', async () => {
      const updateData = {
        status: 'assigned' as const,
        driverId: 'driver-123',
      };

      const mockResult = {
        rows: [{
          id: 'delivery-123',
          customer_id: 'customer-123',
          driver_id: 'driver-123',
          status: 'assigned',
          updated_at: new Date(),
        }],
      };

      mockDatabaseService.query.mockResolvedValue(mockResult);

      const result = await repository.update('delivery-123', updateData);

      expect(mockDatabaseService.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE deliveries'),
        expect.any(Array)
      );
      expect(result?.status).toBe('assigned');
      expect(result?.driverId).toBe('driver-123');
    });

    it('should return null when delivery not found', async () => {
      const mockResult = { rows: [] };
      mockDatabaseService.query.mockResolvedValue(mockResult);

      const result = await repository.update('non-existent-id', { status: 'assigned' });

      expect(result).toBeNull();
    });

    it('should handle empty update data', async () => {
      const result = await repository.update('delivery-123', {});

      expect(mockDatabaseService.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT'),
        ['delivery-123']
      );
    });
  });

  describe('delete', () => {
    it('should delete delivery successfully', async () => {
      const mockResult = { rowCount: 1 };
      mockDatabaseService.query.mockResolvedValue(mockResult);

      const result = await repository.delete('delivery-123');

      expect(mockDatabaseService.query).toHaveBeenCalledWith(
        expect.stringContaining('DELETE FROM deliveries'),
        ['delivery-123']
      );
      expect(result).toBe(true);
    });

    it('should return false when delivery not found', async () => {
      const mockResult = { rowCount: 0 };
      mockDatabaseService.query.mockResolvedValue(mockResult);

      const result = await repository.delete('non-existent-id');

      expect(result).toBe(false);
    });
  });
});