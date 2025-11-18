import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateQuotaCompanyDto {
  // @ApiProperty()
  // @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  // @IsNumber({}, { message: i18nValidationMessage('validation.IS_NUMBER') })
  // @Type(() => Number)
  // readonly company_id: number;

  @ApiProperty()
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsNumber({}, { message: i18nValidationMessage('validation.IS_NUMBER') })
  @Type(() => Number)
  readonly qty: number;

  @ApiProperty()
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsNumber({}, { message: i18nValidationMessage('validation.IS_NUMBER') })
  @Type(() => Number)
  readonly vendor_product_id: number;

  @ApiProperty()
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsDate({ message: i18nValidationMessage('validation.IS_DATE') })
  @Type(() => Date)
  readonly year: Date;
}
