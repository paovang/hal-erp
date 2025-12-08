import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '@src/common/validations/dto/pagination.dto';
import { IsOptional, IsString } from 'class-validator';

export class ReceiptQueryDto extends PaginationDto {
  @ApiProperty({
    required: false,
    description: '',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty()
  @IsOptional()
  department_id?: string;

  @ApiProperty()
  @IsOptional()
  order_date?: string;

  @ApiProperty()
  @IsOptional()
  start_date?: string;

  @ApiProperty()
  @IsOptional()
  end_date?: string;

  @ApiProperty()
  @IsOptional()
  status_id?: string;

  @ApiProperty()
  @IsOptional()
  payment_type?: string;

  @ApiProperty()
  @IsOptional()
  company_id?: string;
}
