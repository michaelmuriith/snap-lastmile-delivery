import { Exclude } from 'class-transformer';

export class UserResponseDto {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'driver' | 'admin';
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;

  @Exclude()
  password: string;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}