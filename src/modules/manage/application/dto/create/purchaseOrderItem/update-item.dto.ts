import { ApiProperty, OmitType } from '@nestjs/swagger';
import { CreatePurchaseOrderItemDto } from './create.dto';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { Type } from 'class-transformer';
import { UpdatePurchaseOrderSelectedVendorDto } from '../purchaseOrderSelectedVendor/update.dto';

export class UpdatePurchaseOrderItemDto extends OmitType(
  CreatePurchaseOrderItemDto,
  ['purchase_request_item_id', 'selected_vendor'] as const,
) {
  @ApiProperty()
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsNumber({}, { message: i18nValidationMessage('validation.IS_NUMBER') })
  id: number;

  @ApiProperty()
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsArray({ message: i18nValidationMessage('validation.IS_ARRAY') })
  @ArrayNotEmpty({
    message: i18nValidationMessage('validation.ARRAY_NOT_EMPTY'),
  })
  @ValidateNested({ each: true })
  @Type(() => UpdatePurchaseOrderSelectedVendorDto)
  readonly selected_vendor: UpdatePurchaseOrderSelectedVendorDto[];
}
