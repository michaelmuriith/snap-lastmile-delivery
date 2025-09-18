"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const migration_service_1 = require("./database/migrations/migration.service");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    if (process.env.NODE_ENV !== 'test') {
        const migrationService = app.get(migration_service_1.MigrationService);
        try {
            await migrationService.runMigrations();
        }
        catch (error) {
            console.error('Failed to run migrations:', error);
            process.exit(1);
        }
    }
    app.enableCors({
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        credentials: true,
    });
    const port = Number(process.env.PORT ?? 3000);
    await app.listen(port, '0.0.0.0');
    console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map