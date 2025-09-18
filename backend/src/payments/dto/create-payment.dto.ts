import { IsString, IsOptional, IsNumber, IsUUID } from 'class-validator';

export class CreatePaymentDto {
  @IsUUID()
  deliveryId: string;

  @IsUUID()
  customerId: string;

  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  currency?: string = 'USD';

  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @IsOptional()
  @IsString()
  paymentGateway?: string;
}