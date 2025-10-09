import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { UpdateReceiptItemDto } from '../receiptItem/update.dto';
import { CreateReceiptDto } from './create.dto';
import { i18nValidationMessage } from 'nestjs-i18n';

export class UpdateReceiptDto extends OmitType(CreateReceiptDto, [
  'remark',
  'document',
  'purchase_order_id',
  'receipt_items',
] as const) {
  @ApiProperty()
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsArray({ message: i18nValidationMessage('validation.IS_ARRAY') })
  @ArrayNotEmpty({
    message: i18nValidationMessage('validation.ARRAY_NOT_EMPTY'),
  })
  @ValidateNested({ each: true })
  @Type(() => UpdateReceiptItemDto)
  receipt_items: UpdateReceiptItemDto[];
}
