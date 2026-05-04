import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsDefined, IsEnum, IsOptional, IsString } from 'class-validator';
import { PurchaseRequestType } from './purchase-request.dto';

export class PurchaseOrderExportQueryDto {
  @ApiProperty({ required: true, description: 'Start of created_at window (ISO 8601)' })
  @IsDefined()
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @ApiProperty({ required: true, description: 'End of created_at window (ISO 8601)' })
  @IsDefined()
  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ required: false, description: 'Filter by department id' })
  @IsOptional()
  department_id?: number;

  @ApiProperty({ required: false, description: 'Filter by company id' })
  @IsOptional()
  company_id?: number;

  @ApiProperty({ required: false, description: 'Filter by type (all or only_user)' })
  @IsOptional()
  @IsEnum(PurchaseRequestType)
  type?: PurchaseRequestType;
}
