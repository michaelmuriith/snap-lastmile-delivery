import { DatabaseService } from '../connection/database.service';
export declare class MigrationService {
    private readonly databaseService;
    private readonly logger;
    constructor(databaseService: DatabaseService);
    runMigrations(): Promise<void>;
    private createMigrationsTable;
    private getMigrationFiles;
    private isMigrationRun;
    private recordMigration;
    getMigrationStatus(): Promise<any[]>;
}
