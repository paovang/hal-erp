import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '@src/common/validations/dto/pagination.dto';
import { IsOptional, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class VendorProductQueryDto extends PaginationDto {
  @ApiProperty({
    required: false,
    description: 'can be vendor name, product name',
  })
  @IsOptional()
  @IsString()
  search?: string;

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
    description: 'filter by product id',
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  product_id?: number;

  @ApiProperty({
    required: false,
    description: 'filter by minimum price',
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  min_price?: number;

  @ApiProperty({
    required: false,
    description: 'filter by maximum price',
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  max_price?: number;
}
