import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { EnumPrOrPo } from '../../../constants/status-key.const';
import { Type } from 'class-transformer';
import { CreateDocumentAttachmentDto } from '../documentSttachment/create.dto';
import { UpdatePurchaseOrderBudgetItemDto } from '../purchaseOrderItem/update.dto';

export class ApprovalDto {
  @ApiProperty()
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsNumber({}, { message: i18nValidationMessage('validation.IS_NUMBER') })
  readonly statusId: number;

  @ApiProperty()
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  readonly remark?: string | null;

  @ApiProperty()
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsBoolean({ message: i18nValidationMessage('validation.IS_BOOLEAN') })
  readonly is_otp: boolean;

  @ApiProperty()
  @ValidateIf((o) => o.is_otp === true)
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsNumber({}, { message: i18nValidationMessage('validation.IS_NUMBER') })
  readonly approval_id: number;

  @ApiProperty()
  @ValidateIf((o) => o.is_otp === true)
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  readonly otp: string;

  @ApiProperty()
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsEnum(EnumPrOrPo, { message: i18nValidationMessage('validation.IS_ENUM') })
  readonly type: EnumPrOrPo;

  @ApiProperty({ type: () => [UpdatePurchaseOrderBudgetItemDto] })
  @ValidateIf((o) => o.type === EnumPrOrPo.PO)
  @IsArray({ message: i18nValidationMessage('validation.IS_ARRAY') })
  @ArrayNotEmpty({
    message: i18nValidationMessage('validation.ARRAY_NOT_EMPTY'),
  })
  @ValidateNested({ each: true })
  @Type(() => UpdatePurchaseOrderBudgetItemDto)
  purchase_order_items: UpdatePurchaseOrderBudgetItemDto[];

  @ApiProperty()
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  readonly account_code?: string;

  @ApiProperty()
  @IsOptional()
  @IsArray({ message: i18nValidationMessage('validation.IS_ARRAY') })
  @ValidateNested({ each: true })
  @Type(() => CreateDocumentAttachmentDto)
  readonly files?: CreateDocumentAttachmentDto[];
}
