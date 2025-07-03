import { PurchaseOrderItemOrmEntity } from '@src/common/infrastructure/database/typeorm/purchase-order-item.orm';
import { PurchaseOrderItemId } from '../../domain/value-objects/purchase-order-item-id.vo';
import { PurchaseOrderItemEntity } from '../../domain/entities/purchase-order-item.entity';
import { Injectable } from '@nestjs/common';
import { PurchaseOrderItemQuoteDataAccessMapper } from './purchase-order-item-quote.mapper';
import { BudgetItemDetailDataAccessMapper } from './budget-item-detail.mapper';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import moment from 'moment-timezone';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';

@Injectable()
export class PurchaseOrderItemDataAccessMapper {
  constructor(
    private readonly _quote: PurchaseOrderItemQuoteDataAccessMapper,
    private readonly _budgetItemDetail: BudgetItemDetailDataAccessMapper,
  ) {}

  toOrmEntity(
    poItemEntity: PurchaseOrderItemEntity,
    method: OrmEntityMethod,
  ): PurchaseOrderItemOrmEntity {
    const now = moment.tz(Timezone.LAOS).format(DateFormat.DATETIME_FORMAT);
    const id = poItemEntity.getId();

    const mediaOrmEntity = new PurchaseOrderItemOrmEntity();
    if (id) {
      mediaOrmEntity.id = id.value;
    }

    mediaOrmEntity.purchase_order_id = poItemEntity.purchase_order_id;
    mediaOrmEntity.purchase_request_item_id =
      poItemEntity.purchase_request_item_id;
    // mediaOrmEntity.budget_item_detail_id = poItemEntity.budget_item_detail_id;
    mediaOrmEntity.remark = poItemEntity.remark;
    if (method === OrmEntityMethod.CREATE) {
      mediaOrmEntity.created_at = poItemEntity.createdAt ?? new Date(now);
    }
    mediaOrmEntity.updated_at = new Date(now);

    return mediaOrmEntity;
  }

  toEntity(ormData: PurchaseOrderItemOrmEntity): PurchaseOrderItemEntity {
    const builder = PurchaseOrderItemEntity.builder()
      .setPurchaseOrderItemId(new PurchaseOrderItemId(ormData.id))
      .setPurchaseOrderId(ormData.purchase_order_id ?? 0)
      .setPurchaseRequestItemId(ormData.purchase_request_item_id ?? 0)
      .setBudgetItemDetailId(ormData.budget_item_detail_id ?? 0)
      .setRemark(ormData.remark ?? '')
      .setCreatedAt(ormData.created_at)
      .setUpdatedAt(ormData.updated_at);

    if (ormData.budget_item_details) {
      builder.setBudgetItemDetail(
        this._budgetItemDetail.toEntity(ormData.budget_item_details),
      );
    }

    if (ormData.purchase_order_item_quotes) {
      builder.setQuote(
        ormData.purchase_order_item_quotes.map((item) =>
          this._quote.toEntity(item),
        ),
      );
    }

    return builder.build();
  }
}
