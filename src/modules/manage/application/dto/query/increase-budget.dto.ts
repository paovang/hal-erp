import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '@src/common/validations/dto/pagination.dto';
import { IsOptional, IsString } from 'class-validator';

export class IncreaseBudgetQueryDto extends PaginationDto {
  @ApiProperty({
    required: false,
    description: 'can be name',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    required: false,
    description: 'Filter by department id',
  })
  @IsOptional()
  @IsString()
  date?: string;

  @IsOptional()
  @IsString()
  budget_account_id?: string;
}
