import { IsEmail, IsString, IsOptional, IsEnum, MinLength, IsPhoneNumber } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsPhoneNumber()
  phone: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsOptional()
  @IsEnum(['customer', 'driver', 'admin'])
  role?: 'customer' | 'driver' | 'admin';
}