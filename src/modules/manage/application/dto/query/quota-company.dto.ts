import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '@src/common/validations/dto/pagination.dto';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class QuotaCompanyQueryDto extends PaginationDto {
  @ApiProperty({
    required: false,
    description: 'can be year',
  })
  @IsOptional()
  @IsString()
  year?: string;

  @ApiProperty({
    required: false,
    description: 'can be company id',
  })
  @IsOptional()
  @IsNumber()
  company_id?: number;
}
