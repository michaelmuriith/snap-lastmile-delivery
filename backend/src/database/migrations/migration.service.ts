import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../connection/database.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MigrationService {
  private readonly logger = new Logger(MigrationService.name);

  constructor(private readonly databaseService: DatabaseService) {}

  async runMigrations(): Promise<void> {
    this.logger.log('Starting database migrations...');

    try {
      // Create migrations table if it doesn't exist
      await this.createMigrationsTable();

      // Get list of migration files
      const migrationFiles = this.getMigrationFiles();

      for (const file of migrationFiles) {
        const migrationName = path.basename(file, '.sql');

        // Check if migration has already been run
        const isRun = await this.isMigrationRun(migrationName);
        if (isRun) {
          this.logger.log(`Migration ${migrationName} already executed, skipping...`);
          continue;
        }

        // Read and execute migration
        this.logger.log(`Executing migration: ${migrationName}`);
        const sql = fs.readFileSync(file, 'utf8');

        await this.databaseService.transaction(async (client) => {
          await client.query(sql);
          await this.recordMigration(client, migrationName);
        });

        this.logger.log(`Migration ${migrationName} completed successfully`);
      }

      this.logger.log('All migrations completed successfully');
    } catch (error) {
      this.logger.error('Migration failed:', error);
      throw error;
    }
  }

  private async createMigrationsTable(): Promise<void> {
    const query = `
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id SERIAL PRIMARY KEY,
        migration_name VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );
    `;

    await this.databaseService.query(query);
  }

  private getMigrationFiles(): string[] {
    const migrationsDir = path.join(__dirname, 'migrations');
    if (!fs.existsSync(migrationsDir)) {
      return [];
    }

    return fs
      .readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort()
      .map(file => path.join(migrationsDir, file));
  }

  private async isMigrationRun(migrationName: string): Promise<boolean> {
    const query = 'SELECT id FROM schema_migrations WHERE migration_name = $1';
    const result = await this.databaseService.query(query, [migrationName]);
    return result.rows.length > 0;
  }

  private async recordMigration(client: any, migrationName: string): Promise<void> {
    const query = 'INSERT INTO schema_migrations (migration_name) VALUES ($1)';
    await client.query(query, [migrationName]);
  }

  async getMigrationStatus(): Promise<any[]> {
    const query = 'SELECT * FROM schema_migrations ORDER BY executed_at DESC';
    const result = await this.databaseService.query(query);
    return result.rows;
  }
}