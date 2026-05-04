import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsDefined, IsEnum, IsOptional, IsString } from 'class-validator';
import { PurchaseRequestType } from './purchase-request.dto';
import { PrintEnum } from '@src/common/enums/print.enum';

export class ReceiptExportQueryDto {
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

  @ApiProperty({ required: false })
  @IsOptional()
  department_id?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  status_id?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  payment_type?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  company_id?: string;

  @ApiProperty({ required: false, description: 'Filter by type (all or only_user)' })
  @IsOptional()
  @IsEnum(PurchaseRequestType)
  type?: PurchaseRequestType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(PrintEnum)
  print?: PrintEnum;
}
