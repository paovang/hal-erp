import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '@src/common/validations/dto/pagination.dto';
import { IsOptional, IsString } from 'class-validator';

export class PurchaseOrderReportQueryDto extends PaginationDto {
  @ApiProperty({
    required: false,
    description: 'can be po_number, vendor_name',
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
    description: 'filter by po date start',
    example: '2023-01-01',
  })
  @IsOptional()
  @IsString()
  start_date?: string;

  @ApiProperty({
    required: false,
    description: 'filter by po date end',
    example: '2023-01-01',
  })
  @IsOptional()
  @IsString()
  end_date?: string;
}
