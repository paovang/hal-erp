import { ApiProperty } from '@nestjs/swagger';
import { NoSpecialChars } from '@src/common/validations/NoSpecialChars.validator';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateCurrencyDto {
  @IsArray({ message: i18nValidationMessage('validation.IS_ARRAY') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @ValidateNested({ each: true })
  @Type(() => CurrencyDto)
  currency: CurrencyDto[];
}

export class CurrencyDto {
  @ApiProperty()
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  readonly name: string;

  @ApiProperty()
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @Length(0, 10, { message: i18nValidationMessage('validation.LENGTH') })
  @NoSpecialChars({
    message: i18nValidationMessage('validation.NO_SPECIAL_CHARS'),
  })
  readonly code: string;
}
