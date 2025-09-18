import { Module, Global } from '@nestjs/common';
import { DatabaseService } from './connection/database.service';
import { MigrationService } from './migrations/migration.service';

@Global()
@Module({
  providers: [DatabaseService, MigrationService],
  exports: [DatabaseService, MigrationService],
})
export class DatabaseModule {}