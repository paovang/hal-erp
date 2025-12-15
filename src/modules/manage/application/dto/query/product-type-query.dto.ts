import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '@src/common/validations/dto/pagination.dto';
import { IsOptional, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class ProductTypeQueryDto extends PaginationDto {
  @ApiProperty({
    required: false,
    description: 'can be code, name',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    required: false,
    description: 'filter by category id',
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  category_id?: number;
}
