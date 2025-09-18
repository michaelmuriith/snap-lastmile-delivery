export declare class UserResponseDto {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: 'customer' | 'driver' | 'admin';
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
    password: string;
    constructor(partial: Partial<UserResponseDto>);
}
