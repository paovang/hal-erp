import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateCompanyVendorDto {
  @ApiProperty({
    required: false,
    description:
      'admin/super-admin only: target company to assign the vendor to. Non-admins are auto-scoped to their own company and this is ignored.',
  })
  @IsOptional()
  @IsNumber({}, { message: i18nValidationMessage('validation.IS_NUMBER') })
  @Type(() => Number)
  readonly company_id?: number;

  @ApiProperty()
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsNumber({}, { message: i18nValidationMessage('validation.IS_NUMBER') })
  @Type(() => Number)
  readonly vendor_id: number;

  @ApiProperty({ required: false, enum: ['active', 'inactive'] })
  @IsOptional()
  @IsEnum(['active', 'inactive'], {
    message: i18nValidationMessage('validation.IS_ENUM'),
  })
  readonly status?: 'active' | 'inactive';

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber({}, { message: i18nValidationMessage('validation.IS_NUMBER') })
  @Type(() => Number)
  readonly credit_term_days?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber({}, { message: i18nValidationMessage('validation.IS_NUMBER') })
  @Type(() => Number)
  readonly credit_limit?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  readonly payment_term?: string | null;
}
