import { DatabaseService } from '../database/connection/database.service';
export interface JwtPayload {
    sub: string;
    email: string;
    role: string;
    iat?: number;
    exp?: number;
}
declare const JwtStrategy_base: new (...args: any) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly databaseService;
    constructor(databaseService: DatabaseService);
    validate(payload: JwtPayload): Promise<{
        id: any;
        name: any;
        email: any;
        phone: any;
        role: any;
        isVerified: any;
        createdAt: any;
        updatedAt: any;
    }>;
}
export {};
