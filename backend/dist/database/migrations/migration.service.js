"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MigrationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MigrationService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../connection/database.service");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let MigrationService = MigrationService_1 = class MigrationService {
    databaseService;
    logger = new common_1.Logger(MigrationService_1.name);
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    async runMigrations() {
        this.logger.log('Starting database migrations...');
        try {
            await this.createMigrationsTable();
            const migrationFiles = this.getMigrationFiles();
            for (const file of migrationFiles) {
                const migrationName = path.basename(file, '.sql');
                const isRun = await this.isMigrationRun(migrationName);
                if (isRun) {
                    this.logger.log(`Migration ${migrationName} already executed, skipping...`);
                    continue;
                }
                this.logger.log(`Executing migration: ${migrationName}`);
                const sql = fs.readFileSync(file, 'utf8');
                await this.databaseService.transaction(async (client) => {
                    await client.query(sql);
                    await this.recordMigration(client, migrationName);
                });
                this.logger.log(`Migration ${migrationName} completed successfully`);
            }
            this.logger.log('All migrations completed successfully');
        }
        catch (error) {
            this.logger.error('Migration failed:', error);
            throw error;
        }
    }
    async createMigrationsTable() {
        const query = `
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id SERIAL PRIMARY KEY,
        migration_name VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );
    `;
        await this.databaseService.query(query);
    }
    getMigrationFiles() {
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
    async isMigrationRun(migrationName) {
        const query = 'SELECT id FROM schema_migrations WHERE migration_name = $1';
        const result = await this.databaseService.query(query, [migrationName]);
        return result.rows.length > 0;
    }
    async recordMigration(client, migrationName) {
        const query = 'INSERT INTO schema_migrations (migration_name) VALUES ($1)';
        await client.query(query, [migrationName]);
    }
    async getMigrationStatus() {
        const query = 'SELECT * FROM schema_migrations ORDER BY executed_at DESC';
        const result = await this.databaseService.query(query);
        return result.rows;
    }
};
exports.MigrationService = MigrationService;
exports.MigrationService = MigrationService = MigrationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], MigrationService);
//# sourceMappingURL=migration.service.js.map