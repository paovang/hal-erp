import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '@src/common/validations/dto/pagination.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PurchaseRequestType } from './purchase-request.dto';

export class PurchaseOrderQueryDto extends PaginationDto {
  @ApiProperty({
    required: false,
    description: 'can be name',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    required: false,
    description: 'Filter by department id',
  })
  @IsOptional()
  department_id?: number;

  @ApiProperty({
    required: false,
    description: 'Filter by order date',
  })
  @IsOptional()
  @IsString()
  order_date?: number;

  @ApiProperty({
    required: false,
    description: 'Filter by department id',
  })
  @IsOptional()
  @IsString()
  company_id?: number;

  @ApiProperty({
    required: false,
    description: 'Filter by type (all or only_user)',
  })
  @IsOptional()
  @IsEnum(PurchaseRequestType)
  type?: PurchaseRequestType;
}
