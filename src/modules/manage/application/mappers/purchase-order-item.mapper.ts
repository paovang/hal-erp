import { Injectable } from '@nestjs/common';
import { PurchaseOrderItemEntity } from '../../domain/entities/purchase-order-item.entity';
import { PurchaseOrderItemResponse } from '../dto/response/purchase-order-item.response';
import moment from 'moment-timezone';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { PurchaseOrderItemQuoteDataMapper } from './purchase-order-item-quote.mapper';
import { BudgetItemDetailDataMapper } from './budget-item-detail.mapper';

interface CustomPurchaseOrderItemDto {
  purchase_request_item_id: number;
  remark: string;
}

@Injectable()
export class PurchaseOrderItemDataMapper {
  constructor(
    private readonly _quote: PurchaseOrderItemQuoteDataMapper,
    private readonly _budgetItemDetail: BudgetItemDetailDataMapper,
  ) {}

  toEntity(
    dto: CustomPurchaseOrderItemDto,
    po_id?: number,
  ): PurchaseOrderItemEntity {
    const builder = PurchaseOrderItemEntity.builder();

    if (po_id) {
      builder.setPurchaseOrderId(po_id);
    }

    if (dto.purchase_request_item_id) {
      builder.setPurchaseRequestItemId(dto.purchase_request_item_id);
    }

    if (dto.remark) {
      builder.setRemark(dto.remark);
    }

    return builder.build();
  }

  /** Mapper Entity To Response */
  toResponse(entity: PurchaseOrderItemEntity): PurchaseOrderItemResponse {
    const response = new PurchaseOrderItemResponse();
    response.id = entity.getId().value;
    response.purchase_order_id = Number(entity.purchase_order_id);
    response.purchase_request_item_id = Number(entity.purchase_request_item_id);
    response.budget_item_detail_id = Number(entity.budget_item_detail_id);
    response.remark = entity.remark;
    response.created_at = moment
      .tz(entity.createdAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);
    response.updated_at = moment
      .tz(entity.updatedAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);

    response.budget_item_detail = entity.budgetItemDetail
      ? this._budgetItemDetail.toResponse(entity.budgetItemDetail)
      : null;

    response.order_item_quote =
      entity.quote?.map((quote) => this._quote.toResponse(quote)) ?? null;

    return response;
  }
}
