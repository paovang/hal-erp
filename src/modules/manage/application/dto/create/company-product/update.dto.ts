import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { i18nValidationMessage } from 'nestjs-i18n';

// Update operates on a single company_products row (by id) — e.g. toggling
// status — so it keeps a single product_id, unlike the array-based create.
export class UpdateCompanyProductDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber({}, { message: i18nValidationMessage('validation.IS_NUMBER') })
  @Type(() => Number)
  readonly company_id?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber({}, { message: i18nValidationMessage('validation.IS_NUMBER') })
  @Type(() => Number)
  readonly product_id?: number;

  @ApiProperty({ required: false, enum: ['active', 'inactive'] })
  @IsOptional()
  @IsEnum(['active', 'inactive'], {
    message: i18nValidationMessage('validation.IS_ENUM'),
  })
  readonly status?: 'active' | 'inactive';
}
