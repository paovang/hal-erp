import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '@src/common/validations/dto/pagination.dto';
import { IsOptional, IsString, IsNumber, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export class ProductQueryDto extends PaginationDto {
  @ApiProperty({
    required: false,
    description: 'can be name, description',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    required: false,
    description: 'filter by product type id',
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  product_type_id?: number;

  @ApiProperty({
    required: false,
    enum: ['active', 'inactive'],
    description: 'filter by status',
  })
  @IsOptional()
  @IsEnum(['active', 'inactive'])
  status?: 'active' | 'inactive';

  @ApiProperty({
    required: false,
    description:
      'admin/super-admin only: inspect a specific company’s active selection (company_products). Non-admins are always auto-scoped to their own company and this is ignored.',
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  company_id?: number;
}
