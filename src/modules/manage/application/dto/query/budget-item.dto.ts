import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '@src/common/validations/dto/pagination.dto';
import { IsOptional, IsString } from 'class-validator';

export class BudgetItemQueryDto extends PaginationDto {
  @ApiProperty({
    required: false,
    description: 'Search budget items by code or name',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  fiscal_year?: string;

  @IsOptional()
  @IsString()
  budget_account_id?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  department_id?: string;

  @IsOptional()
  @IsString()
  company_id?: string;
}
