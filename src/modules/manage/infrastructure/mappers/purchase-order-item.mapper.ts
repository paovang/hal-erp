import { PurchaseOrderItemOrmEntity } from '@src/common/infrastructure/database/typeorm/purchase-order-item.orm';
import { PurchaseOrderItemId } from '../../domain/value-objects/purchase-order-item-id.vo';
import { PurchaseOrderItemEntity } from '../../domain/entities/purchase-order-item.entity';
import { Injectable } from '@nestjs/common';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import moment from 'moment-timezone';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import {
  SelectStatus,
  VAT_RATE,
} from '../../application/constants/status-key.const';
import { PurchaseOrderSelectedVendorDataAccessMapper } from './purchase-order-selected-vendor.mapper';
import { BudgetItemDataAccessMapper } from './budget-item.mapper';
import { PurchaseRequestItemDataAccessMapper } from './purchase-request-item.mapper';

@Injectable()
export class PurchaseOrderItemDataAccessMapper {
  constructor(
    private readonly _budgetItem: BudgetItemDataAccessMapper,
    private readonly _purchaseRequestItem: PurchaseRequestItemDataAccessMapper,
    private readonly _selectedVendor: PurchaseOrderSelectedVendorDataAccessMapper,
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
    if (method === OrmEntityMethod.UPDATE) {
      mediaOrmEntity.budget_item_id = poItemEntity.budget_item_id;
    }
    mediaOrmEntity.remark = poItemEntity.remark;
    mediaOrmEntity.quantity = poItemEntity.quantity;
    mediaOrmEntity.price = poItemEntity.price;
    mediaOrmEntity.total = poItemEntity.total;
    mediaOrmEntity.is_vat = poItemEntity.is_vat
      ? SelectStatus.TRUE
      : SelectStatus.FALSE;
    mediaOrmEntity.vat = poItemEntity.vat;

    if (method === OrmEntityMethod.CREATE) {
      mediaOrmEntity.created_at = poItemEntity.createdAt ?? new Date(now);
    }
    mediaOrmEntity.updated_at = new Date(now);

    return mediaOrmEntity;
  }

  toEntity(ormData: PurchaseOrderItemOrmEntity): PurchaseOrderItemEntity {
    const isVat = (ormData.is_vat as SelectStatus) === SelectStatus.TRUE;

    const total = Number(ormData.total ?? 0);
    const vatAmount = Number(isVat) ? Number(total) * (VAT_RATE / 100) : 0;
    const totalWithVat = total + vatAmount;

    const builder = PurchaseOrderItemEntity.builder()
      .setPurchaseOrderItemId(new PurchaseOrderItemId(ormData.id))
      .setPurchaseOrderId(ormData.purchase_order_id ?? 0)
      .setPurchaseRequestItemId(ormData.purchase_request_item_id ?? 0)
      .setBudgetItemId(ormData.budget_item_id ?? 0)
      .setRemark(ormData.remark ?? '')
      .setQuantity(ormData.quantity ?? 0)
      .setPrice(ormData.price ?? 0)
      .setTotal(ormData.total ?? 0)
      .setIsVat(
        (ormData.is_vat as SelectStatus) === SelectStatus.TRUE ? true : false,
      )
      .setCreatedAt(ormData.created_at)
      .setUpdatedAt(ormData.updated_at)
      .setVatTotal(vatAmount)
      .setTotalWithVat(totalWithVat);

    if (ormData.budget_item) {
      builder.setBudgetItem(this._budgetItem.toEntity(ormData.budget_item));
    }

    if (ormData.purchase_request_items) {
      builder.setPurchaseRequestItem(
        this._purchaseRequestItem.toEntity(ormData.purchase_request_items),
      );
    }

    if (ormData.purchase_order_selected_vendors) {
      builder.setSelectedVendor(
        ormData.purchase_order_selected_vendors.map((vendor) =>
          this._selectedVendor.toEntity(vendor),
        ),
      );
    }

    return builder.build();
  }
}
