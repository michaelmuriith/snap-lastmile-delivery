import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { DatabaseService } from '../src/database/connection/database.service';

describe('Deliveries (e2e)', () => {
  let app: INestApplication;
  let databaseService: DatabaseService;
  let authToken: string;
  let customerId: string;
  let deliveryId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    databaseService = moduleFixture.get<DatabaseService>(DatabaseService);

    await app.init();

    // Create a test customer and get auth token
    const customerResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: 'Test Customer',
        email: 'customer@test.com',
        phone: '+1234567890',
        password: 'password123',
        role: 'customer',
      })
      .expect(201);

    authToken = customerResponse.body.access_token;
    customerId = customerResponse.body.user.id;
  });

  afterAll(async () => {
    // Clean up test data
    if (deliveryId) {
      await databaseService.query('DELETE FROM deliveries WHERE id = $1', [deliveryId]);
    }
    if (customerId) {
      await databaseService.query('DELETE FROM users WHERE id = $1', [customerId]);
    }
    await app.close();
  });

  describe('POST /deliveries', () => {
    it('should create a delivery successfully', async () => {
      const createDeliveryDto = {
        customerId,
        type: 'send',
        pickupAddress: '123 Main St, New York, NY',
        deliveryAddress: '456 Oak Ave, Los Angeles, CA',
        packageDescription: 'Test package with documents',
        pickupLatitude: 40.7128,
        pickupLongitude: -74.0060,
        deliveryLatitude: 34.0522,
        deliveryLongitude: -118.2437,
        packageValue: 100.50,
        recipientName: 'John Doe',
        recipientPhone: '+1987654321',
      };

      const response = await request(app.getHttpServer())
        .post('/deliveries')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createDeliveryDto)
        .expect(201);

      expect(response.body).toBeDefined();
      expect(response.body.id).toBeDefined();
      expect(response.body.customerId).toBe(customerId);
      expect(response.body.type).toBe('send');
      expect(response.body.status).toBe('pending');
      expect(response.body.pickupAddress).toBe(createDeliveryDto.pickupAddress);
      expect(response.body.deliveryAddress).toBe(createDeliveryDto.deliveryAddress);
      expect(response.body.packageDescription).toBe(createDeliveryDto.packageDescription);
      expect(response.body.createdAt).toBeDefined();
      expect(response.body.updatedAt).toBeDefined();

      deliveryId = response.body.id;
    });

    it('should create delivery with minimal required fields', async () => {
      const minimalDeliveryDto = {
        customerId,
        type: 'receive',
        pickupAddress: '789 Pine St, Chicago, IL',
        deliveryAddress: '321 Elm St, Boston, MA',
        packageDescription: 'Simple package',
      };

      const response = await request(app.getHttpServer())
        .post('/deliveries')
        .set('Authorization', `Bearer ${authToken}`)
        .send(minimalDeliveryDto)
        .expect(201);

      expect(response.body).toBeDefined();
      expect(response.body.id).toBeDefined();
      expect(response.body.customerId).toBe(customerId);
      expect(response.body.type).toBe('receive');
      expect(response.body.status).toBe('pending');
      expect(response.body.packageDescription).toBe(minimalDeliveryDto.packageDescription);
    });

    it('should reject delivery creation without authentication', async () => {
      const createDeliveryDto = {
        customerId,
        type: 'send',
        pickupAddress: '123 Main St',
        deliveryAddress: '456 Oak Ave',
        packageDescription: 'Test package',
      };

      await request(app.getHttpServer())
        .post('/deliveries')
        .send(createDeliveryDto)
        .expect(401);
    });

    it('should validate required fields', async () => {
      const invalidDeliveryDto = {
        customerId,
        // Missing required fields
      };

      await request(app.getHttpServer())
        .post('/deliveries')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidDeliveryDto)
        .expect(400);
    });
  });

  describe('GET /deliveries/:id', () => {
    it('should return delivery by ID', async () => {
      const response = await request(app.getHttpServer())
        .get(`/deliveries/${deliveryId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.id).toBe(deliveryId);
      expect(response.body.customerId).toBe(customerId);
      expect(response.body.status).toBe('pending');
    });

    it('should return 404 for non-existent delivery', async () => {
      await request(app.getHttpServer())
        .get('/deliveries/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should require authentication', async () => {
      await request(app.getHttpServer())
        .get(`/deliveries/${deliveryId}`)
        .expect(401);
    });
  });

  describe('GET /deliveries', () => {
    it('should return deliveries for authenticated customer', async () => {
      const response = await request(app.getHttpServer())
        .get('/deliveries')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.deliveries).toBeDefined();
      expect(Array.isArray(response.body.deliveries)).toBe(true);
      expect(response.body.total).toBeDefined();
      expect(typeof response.body.total).toBe('number');
    });

    it('should filter deliveries by status', async () => {
      const response = await request(app.getHttpServer())
        .get('/deliveries?status=pending')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.deliveries).toBeDefined();
      response.body.deliveries.forEach((delivery: any) => {
        expect(delivery.status).toBe('pending');
      });
    });

    it('should support pagination', async () => {
      const response = await request(app.getHttpServer())
        .get('/deliveries?page=1&limit=10')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.deliveries).toBeDefined();
      expect(response.body.deliveries.length).toBeLessThanOrEqual(10);
      expect(response.body.total).toBeDefined();
    });

    it('should require authentication', async () => {
      await request(app.getHttpServer())
        .get('/deliveries')
        .expect(401);
    });
  });

  describe('PATCH /deliveries/:id/status', () => {
    it('should update delivery status successfully', async () => {
      const statusUpdate = {
        status: 'picked_up',
        estimatedDeliveryTime: '2025-01-01T14:00:00Z',
      };

      const response = await request(app.getHttpServer())
        .patch(`/deliveries/${deliveryId}/status`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(statusUpdate)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.id).toBe(deliveryId);
      expect(response.body.status).toBe('picked_up');
      expect(response.body.estimatedDeliveryTime).toBeDefined();
    });

    it('should handle delivery completion', async () => {
      const completionUpdate = {
        status: 'delivered',
        actualDeliveryTime: new Date().toISOString(),
      };

      const response = await request(app.getHttpServer())
        .patch(`/deliveries/${deliveryId}/status`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(completionUpdate)
        .expect(200);

      expect(response.body.status).toBe('delivered');
      expect(response.body.actualDeliveryTime).toBeDefined();
    });

    it('should return 404 for non-existent delivery', async () => {
      const statusUpdate = { status: 'in_transit' };

      await request(app.getHttpServer())
        .patch('/deliveries/non-existent-id/status')
        .set('Authorization', `Bearer ${authToken}`)
        .send(statusUpdate)
        .expect(404);
    });

    it('should require authentication', async () => {
      const statusUpdate = { status: 'in_transit' };

      await request(app.getHttpServer())
        .patch(`/deliveries/${deliveryId}/status`)
        .send(statusUpdate)
        .expect(401);
    });
  });

  describe('PUT /deliveries/:id/assign-driver', () => {
    it('should require admin role for driver assignment', async () => {
      // This test would require admin authentication
      // For now, we'll just test that the endpoint exists
      const driverId = 'driver-123';

      await request(app.getHttpServer())
        .put(`/deliveries/${deliveryId}/assign-driver`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ driverId })
        .expect(403); // Forbidden - customer cannot assign drivers
    });
  });
});