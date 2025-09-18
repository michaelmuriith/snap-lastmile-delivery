import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Pool } from 'pg';
export declare class DatabaseService implements OnModuleInit, OnModuleDestroy {
    private pool;
    constructor();
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    getPool(): Pool;
    query(text: string, params?: any[]): Promise<any>;
    getClient(): Promise<any>;
    transaction<T>(callback: (client: any) => Promise<T>): Promise<T>;
}
