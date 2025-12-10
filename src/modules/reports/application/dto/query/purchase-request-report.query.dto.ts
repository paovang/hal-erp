import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '@src/common/validations/dto/pagination.dto';
import { IsOptional, IsString } from 'class-validator';

export class PurchaseRequestReportQueryDto extends PaginationDto {
  @ApiProperty({
    required: false,
    description: 'can be code, name',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    required: false,
    description: 'filter by status id',
  })
  @IsOptional()
  status_id?: number;

  @ApiProperty({
    required: false,
    description: 'filter by department id',
  })
  @IsOptional()
  department_id?: number;

  @ApiProperty({
    required: false,
    description: 'filter by department id',
  })
  @IsOptional()
  company_id?: number;

  @ApiProperty({
    required: false,
    description: 'filter by requested date start',
    example: '2023-01-01',
  })
  @IsOptional()
  @IsString()
  requested_date_start?: string;

  @ApiProperty({
    required: false,
    description: 'filter by requested date end',
    example: '2023-01-01',
  })
  @IsOptional()
  @IsString()
  requested_date_end?: string;
}
