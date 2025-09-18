export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'customer' | 'driver' | 'admin';
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserData {
  name: string;
  email: string;
  phone: string;
  password: string;
  role?: 'customer' | 'driver' | 'admin';
  isVerified?: boolean;
}

export interface UpdateUserData {
  name?: string;
  phone?: string;
  isVerified?: boolean;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'driver' | 'admin';
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}