import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserPayload } from '../auth/auth.service';
interface AuthenticatedRequest extends Request {
    user: UserPayload;
}
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<import("./dto/user-response.dto").UserResponseDto>;
    findAll(page: number, limit: number, role?: string): Promise<{
        data: import("./dto/user-response.dto").UserResponseDto[];
        meta: any;
    }>;
    getProfile(req: AuthenticatedRequest): Promise<import("./dto/user-response.dto").UserResponseDto>;
    findDrivers(): Promise<import("./dto/user-response.dto").UserResponseDto[]>;
    findCustomers(): Promise<import("./dto/user-response.dto").UserResponseDto[]>;
    findOne(id: string, req: AuthenticatedRequest): Promise<import("./dto/user-response.dto").UserResponseDto>;
    updateProfile(req: AuthenticatedRequest, updateUserDto: UpdateUserDto): Promise<import("./dto/user-response.dto").UserResponseDto>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<import("./dto/user-response.dto").UserResponseDto>;
    verifyUser(id: string): Promise<import("./dto/user-response.dto").UserResponseDto>;
    remove(id: string): Promise<void>;
}
export {};
