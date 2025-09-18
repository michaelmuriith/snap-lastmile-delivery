import { IsString, IsOptional, IsNumber, IsEnum, IsUUID } from 'class-validator';
import { DeliveryType } from '../entities/delivery.entity';

export enum DeliveryTypeEnum {
  SEND = 'send',
  RECEIVE = 'receive',
  STORE_PICKUP = 'store_pickup',
}

export class CreateDeliveryDto {
  @IsUUID()
  customerId: string;

  @IsEnum(DeliveryTypeEnum)
  type: DeliveryTypeEnum;

  @IsString()
  pickupAddress: string;

  @IsOptional()
  @IsNumber()
  pickupLatitude?: number;

  @IsOptional()
  @IsNumber()
  pickupLongitude?: number;

  @IsString()
  deliveryAddress: string;

  @IsOptional()
  @IsNumber()
  deliveryLatitude?: number;

  @IsOptional()
  @IsNumber()
  deliveryLongitude?: number;

  @IsString()
  packageDescription: string;

  @IsOptional()
  @IsNumber()
  packageValue?: number;

  @IsOptional()
  @IsString()
  recipientName?: string;

  @IsOptional()
  @IsString()
  recipientPhone?: string;
}