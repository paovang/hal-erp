import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '@src/common/validations/dto/pagination.dto';
import { IsOptional, IsString } from 'class-validator';

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
    description: 'Filter by document type id',
  })
  @IsOptional()
  document_type_id?: number;

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
}
