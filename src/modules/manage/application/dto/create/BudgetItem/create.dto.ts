import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateBudgetItemDto {
  @ApiProperty()
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  readonly name: string;

  // @ApiProperty() //ddd
  // @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  // @IsNumber({}, { message: i18nValidationMessage('validation.IS_NUMBER') })
  // readonly allocated_amount: number;

  @ApiProperty()
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsNumber({}, { message: i18nValidationMessage('validation.IS_NUMBER') })
  readonly budget_accountId: number;

  @ApiProperty()
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  readonly description: string;

  // @ApiProperty()
  // @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  // @IsArray({ message: i18nValidationMessage('validation.IS_ARRAY') })
  // @ArrayNotEmpty({
  //   message: i18nValidationMessage('validation.ARRAY_NOT_EMPTY'),
  // })
  // @ValidateNested({ each: true })
  // @Type(() => CreateBudgetItemDetailDto)
  // budget_item_details: CreateBudgetItemDetailDto[];
}
