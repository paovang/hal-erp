import { ApiProperty, OmitType } from '@nestjs/swagger';
import { CreateReceiptItemDto } from './create.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class UpdateReceiptItemDto extends OmitType(CreateReceiptItemDto, [
  'purchase_order_item_id',
  'currency_id',
] as const) {
  @ApiProperty()
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsNumber({}, { message: i18nValidationMessage('validation.IS_NUMBER') })
  id: number;
}
