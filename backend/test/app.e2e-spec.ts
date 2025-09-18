import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('message', 'SNAP API Server');
        expect(res.body).toHaveProperty('version', '1.0.0');
        expect(res.body).toHaveProperty('status', 'running');
        expect(res.body).toHaveProperty('timestamp');
        expect(res.body).toHaveProperty('endpoints');
      });
  });
});
