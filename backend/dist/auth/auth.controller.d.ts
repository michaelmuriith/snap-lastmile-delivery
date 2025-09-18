import { AuthService, UserPayload } from './auth.service';
interface AuthenticatedRequest extends Request {
    user: UserPayload;
}
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: {
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
    login(req: AuthenticatedRequest): Promise<{
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
    refresh(refreshTokenDto: {
        refreshToken: string;
    }): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    logout(req: AuthenticatedRequest): Promise<{
        message: string;
    }>;
    getProfile(req: AuthenticatedRequest): UserPayload;
    getAdminData(): {
        message: string;
    };
}
export {};
