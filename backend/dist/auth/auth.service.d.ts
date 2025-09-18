import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
export interface UserPayload {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<UserPayload | null>;
    register(userData: {
        name: string;
        email: string;
        phone: string;
        password: string;
        role?: string;
    }): Promise<{
        access_token: string;
        refresh_token: string;
        user: import("../users/dto/user-response.dto").UserResponseDto;
    }>;
    login(user: UserPayload): Promise<{
        access_token: string;
        refresh_token: string;
        user: {
            id: string;
            name: string;
            email: string;
            phone: string;
            role: string;
            isVerified: boolean;
        };
    }>;
    refreshToken(refreshToken: string): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    logout(userId: string): Promise<{
        message: string;
    }>;
    private generateRefreshToken;
}
