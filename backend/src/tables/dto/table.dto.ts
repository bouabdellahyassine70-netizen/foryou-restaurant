import { IsInt, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTableDto {
  @ApiProperty()
  @IsInt()
  number: number;

  @ApiProperty({ required: false, default: 4 })
  @IsOptional()
  @IsInt()
  capacity?: number;
}

export class UpdateTableDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  capacity?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

