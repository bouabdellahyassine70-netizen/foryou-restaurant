import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderItemDto } from './order.dto';

export class VoiceOrderDto {
  @ApiProperty({ description: 'Voice AI order ID from SAWT IA system' })
  @IsString()
  voiceOrderId: string;

  @ApiProperty({ description: 'Customer phone number from voice call' })
  @IsString()
  customerPhone: string;

  @ApiProperty({ description: 'Customer name (if extracted from voice)' })
  @IsOptional()
  @IsString()
  customerName?: string;

  @ApiProperty({ type: [OrderItemDto], description: 'Order items extracted from voice' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({ description: 'Order type determined from voice', enum: ['DINE_IN', 'TAKEAWAY', 'DELIVERY'] })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiProperty({ description: 'Delivery address (if delivery order)', required: false })
  @IsOptional()
  @IsString()
  deliveryAddress?: string;

  @ApiProperty({ description: 'Special instructions from voice', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
