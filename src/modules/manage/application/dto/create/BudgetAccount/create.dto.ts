import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

const currentYear = new Date().getFullYear();

export class CreateBudgetAccountDto {
  @ApiProperty()
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  readonly name: string;

  @ApiProperty()
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsInt({ message: i18nValidationMessage('validation.IS_INT') })
  @Min(currentYear, {
    message: i18nValidationMessage('validation.YEAR_MUST_BE_CURRENT_OR_NEXT'),
  })
  @Max(currentYear + 1, {
    message: i18nValidationMessage('validation.YEAR_MUST_BE_CURRENT_OR_NEXT'),
  })
  readonly fiscal_year: number;

  @ApiProperty()
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsNumber({}, { message: i18nValidationMessage('validation.IS_NUMBER') })
  readonly allocated_amount: number;

  @ApiProperty()
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsNumber({}, { message: i18nValidationMessage('validation.IS_NUMBER') })
  readonly departmentId: number;

  // test commit
}
