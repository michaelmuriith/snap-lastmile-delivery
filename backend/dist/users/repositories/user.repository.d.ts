import { DatabaseService } from '../../database/connection/database.service';
import { User, CreateUserData, UpdateUserData } from '../entities/user.entity';
export declare class UserRepository {
    private readonly databaseService;
    constructor(databaseService: DatabaseService);
    create(userData: CreateUserData): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    findAll(page?: number, limit?: number, role?: string): Promise<{
        users: User[];
        total: number;
    }>;
    update(id: string, updateData: UpdateUserData): Promise<User | null>;
    delete(id: string): Promise<boolean>;
    findByRole(role: string): Promise<User[]>;
}
