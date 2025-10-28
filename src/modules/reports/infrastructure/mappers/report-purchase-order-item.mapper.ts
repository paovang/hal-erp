import { PurchaseOrderItemOrmEntity } from '@src/common/infrastructure/database/typeorm/purchase-order-item.orm';
import { Injectable } from '@nestjs/common';
import { BudgetItemDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/budget-item.mapper';
import { PurchaseRequestItemDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/purchase-request-item.mapper';
import { PurchaseOrderSelectedVendorDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/purchase-order-selected-vendor.mapper';
import { ReportPurchaseOrderItemEntity } from '../../domain/entities/report-purchase-order-item.entity';
import { SelectStatus } from '@src/modules/manage/application/constants/status-key.const';
import { ReportPurchaseOrderItemId } from '../../domain/value-objects/report-purchase-order-item-id.vo';
@Injectable()
export class ReportPurchaseOrderItemDataAccessMapper {
  constructor(
    private readonly _budgetItem: BudgetItemDataAccessMapper,
    private readonly _purchaseRequestItem: PurchaseRequestItemDataAccessMapper,
    private readonly _selectedVendor: PurchaseOrderSelectedVendorDataAccessMapper,
  ) {}

  toEntity(ormData: PurchaseOrderItemOrmEntity): ReportPurchaseOrderItemEntity {
    const isVat = (ormData.is_vat as SelectStatus) === SelectStatus.TRUE;

    const total = Number(ormData.total ?? 0);
    const vatAmount = isVat ? Number(ormData.vat ?? 0) : 0;
    const totalWithVat = total + vatAmount;

    const builder = ReportPurchaseOrderItemEntity.builder()
      .setPurchaseOrderItemId(new ReportPurchaseOrderItemId(ormData.id))
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
