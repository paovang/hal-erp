import { OmitType } from '@nestjs/swagger';
import { CreatePurchaseRequestDto } from './create.dto';
import { UpdatePurchaseRequestItemDto } from '../purchaseRequestItem/update.dto';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdatePurchaseRequestDto extends OmitType(
  CreatePurchaseRequestDto,
  ['document', 'purchase_request_items'] as const,
) {
  @ValidateNested({ each: true })
  @Type(() => UpdatePurchaseRequestItemDto)
  purchase_request_items: UpdatePurchaseRequestItemDto[];
}
