import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '@src/common/validations/dto/pagination.dto';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class BudgetAccountQueryDto extends PaginationDto {
  @ApiProperty({
    required: false,
    description: 'can be name',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: i18nValidationMessage('validation.IS_NUMBER') })
  fiscal_year?: number;

  @IsOptional()
  type?: string;
}
