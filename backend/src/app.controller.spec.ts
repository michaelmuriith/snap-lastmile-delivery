import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return API information', () => {
      const result = appController.getHello() as any;
      expect(result).toHaveProperty('message', 'SNAP API Server');
      expect(result).toHaveProperty('version', '1.0.0');
      expect(result).toHaveProperty('status', 'running');
      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('endpoints');
      expect(result.endpoints).toHaveProperty('auth', '/auth');
      expect(result.endpoints).toHaveProperty('users', '/users');
      expect(result.endpoints).toHaveProperty('deliveries', '/deliveries');
      expect(result.endpoints).toHaveProperty('tracking', '/tracking');
    });
  });
});
