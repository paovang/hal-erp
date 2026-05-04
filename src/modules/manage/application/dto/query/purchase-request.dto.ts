import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '@src/common/validations/dto/pagination.dto';
import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
export enum PurchaseRequestType {
  all = 'all',
  only_user = 'only_user',
}

export class PurchaseRequestQueryDto extends PaginationDto {
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
    description: 'Filter by company id',
  })
  @IsOptional()
  @IsString()
  company_id?: number;

  @ApiProperty({
    required: false,
    description: 'Filter by approval status id',
  })
  @IsOptional()
  status_id?: number;

  @ApiProperty({
    required: false,
    description: 'Filter by date',
  })
  @IsOptional()
  date?: string;

  @ApiProperty({
    required: false,
    description: 'Filter by vendor id',
  })
  @IsOptional()
  @IsString()
  token?: string;

  @ApiProperty({
    required: false,
    description: 'Filter by type (all or only_user)',
  })
  @IsOptional()
  @IsEnum(PurchaseRequestType)
  type?: PurchaseRequestType;

  @IsDate()
  @IsOptional()
  startDate?: Date;

  @IsDate()
  @IsOptional()
  endDate?: Date;
}
