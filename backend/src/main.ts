import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MigrationService } from './database/migrations/migration.service';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Run DB migrations
  if (process.env.NODE_ENV !== 'test') {
    const migrationService = app.get(MigrationService);
    try {
      await migrationService.runMigrations();
    } catch (error) {
      console.error('Failed to run migrations:', error);
      process.exit(1);
    }
  }

  // CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  });

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port, '0.0.0.0');       // ← important in Docker
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
