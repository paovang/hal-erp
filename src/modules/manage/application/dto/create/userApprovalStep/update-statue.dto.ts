import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
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
  @IsEnum(EnumPrOrPo, { message: i18nValidationMessage('validation.IS_ENUM') })
  readonly type: EnumPrOrPo;

  @ApiProperty()
  @ValidateIf((o) => o.type === EnumPrOrPo.PO)
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  purchase_order_items: UpdatePurchaseOrderBudgetItemDto;

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
