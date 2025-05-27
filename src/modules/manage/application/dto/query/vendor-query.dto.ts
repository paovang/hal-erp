import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '@src/common/validations/dto/pagination.dto';
import { IsOptional, IsString } from 'class-validator';

export class VendorQueryDto extends PaginationDto {
  @ApiProperty({
    required: false,
    description: 'can be name, contact_info',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
