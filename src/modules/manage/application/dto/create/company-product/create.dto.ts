import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateCompanyProductDto {
  @ApiProperty({
    required: false,
    description:
      'admin/super-admin only: target company to assign products to. Non-admins are auto-scoped to their own company and this is ignored.',
  })
  @IsOptional()
  @IsNumber({}, { message: i18nValidationMessage('validation.IS_NUMBER') })
  @Type(() => Number)
  readonly company_id?: number;

  @ApiProperty({
    type: [Number],
    description: 'list of product ids to assign to the company',
  })
  @IsArray({ message: i18nValidationMessage('validation.IS_ARRAY') })
  @ArrayNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsNumber(
    {},
    { each: true, message: i18nValidationMessage('validation.IS_NUMBER') },
  )
  @Type(() => Number)
  readonly product_ids: number[];

  @ApiProperty({ required: false, enum: ['active', 'inactive'] })
  @IsOptional()
  @IsEnum(['active', 'inactive'], {
    message: i18nValidationMessage('validation.IS_ENUM'),
  })
  readonly status?: 'active' | 'inactive';
}
