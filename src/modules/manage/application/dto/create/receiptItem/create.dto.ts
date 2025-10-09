import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { EnumPaymentType } from '../../../constants/status-key.const';

export class CreateReceiptItemDto {
  @ApiProperty()
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsNumber({}, { message: i18nValidationMessage('validation.IS_NUMBER') })
  readonly purchase_order_item_id: number;

  // @ApiProperty()
  // @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  // @IsNumber({}, { message: i18nValidationMessage('validation.IS_NUMBER') })
  // readonly currency_id: number;

  @ApiProperty()
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsNumber({}, { message: i18nValidationMessage('validation.IS_NUMBER') })
  readonly payment_currency_id: number;

  @ApiProperty()
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsEnum(EnumPaymentType, {
    message: i18nValidationMessage('validation.INVALID_ENUM'),
  })
  readonly payment_type: EnumPaymentType;

  @ApiProperty()
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  readonly remark: string;
}
