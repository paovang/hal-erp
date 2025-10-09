import { ApiProperty, OmitType } from '@nestjs/swagger';
import { CreatePurchaseOrderDto } from './create.dto';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { EnumType } from '../../../constants/status-key.const';
import { UpdatePurchaseOrderBudgetItemDto } from '../purchaseOrderItem/update.dto';
import { Type } from 'class-transformer';
import { UpdatePurchaseOrderItemDto } from '../purchaseOrderItem/update-item.dto';

export class UpdatePurchaseOrderDto extends OmitType(CreatePurchaseOrderDto, [
  'purchase_request_id',
  'document',
  'items',
] as const) {
  // @ValidateNested({ each: true })
  // @Type(() => CreatePurchaseOrderItemDto)
  // selected_vendor: CreatePurchaseOrderItemDto[];

  @ApiProperty()
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsEnum(EnumType, {
    message: i18nValidationMessage('validation.IS_ENUM_TYPE'),
  })
  readonly type: EnumType;

  @ApiProperty()
  @ValidateIf((o) => o.type === EnumType.BUDGET_ITEM_DETAIL)
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  purchase_order_items: UpdatePurchaseOrderBudgetItemDto;

  @ApiProperty()
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsArray({ message: i18nValidationMessage('validation.IS_ARRAY') })
  @ArrayNotEmpty({
    message: i18nValidationMessage('validation.ARRAY_NOT_EMPTY'),
  })
  @ValidateNested({ each: true })
  @Type(() => UpdatePurchaseOrderItemDto)
  readonly items: UpdatePurchaseOrderItemDto[];
}
