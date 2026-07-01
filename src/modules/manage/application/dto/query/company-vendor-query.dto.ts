import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '@src/common/validations/dto/pagination.dto';
import { IsOptional, IsString, IsNumber, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export class CompanyVendorQueryDto extends PaginationDto {
  @ApiProperty({
    required: false,
    description: 'can be vendor name, company name',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    required: false,
    description: 'filter by company id',
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  company_id?: number;

  @ApiProperty({
    required: false,
    description: 'filter by vendor id',
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  vendor_id?: number;

  @ApiProperty({
    required: false,
    enum: ['active', 'inactive'],
    description: 'filter by status',
  })
  @IsOptional()
  @IsEnum(['active', 'inactive'])
  status?: 'active' | 'inactive';
}
