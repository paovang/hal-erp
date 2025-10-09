import { Injectable } from '@nestjs/common';
import moment from 'moment-timezone';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { BudgetItemDataMapper } from '@src/modules/manage/application/mappers/budget-item.mapper';
import { PurchaseRequestItemDataMapper } from '@src/modules/manage/application/mappers/purchase-request-item.mapper';
import { PurchaseOrderSelectedVendorDataMapper } from '@src/modules/manage/application/mappers/purchase-order-selected-vendor.mapper';
import { ReportPurchaseOrderItemResponse } from '../dto/response/report-purchase-order-item.response';
import { PurchaseOrderItemEntity } from '@src/modules/manage/domain/entities/purchase-order-item.entity';
@Injectable()
export class ReportPurchaseOrderItemDataMapper {
  constructor(
    private readonly _budgetItem: BudgetItemDataMapper,
    private readonly _purchaseRequestItem: PurchaseRequestItemDataMapper,
    private readonly _selectedVendorMapper: PurchaseOrderSelectedVendorDataMapper,
  ) {}
  /** Mapper Entity To Response */
  toResponse(entity: PurchaseOrderItemEntity): ReportPurchaseOrderItemResponse {
    const response = new ReportPurchaseOrderItemResponse();
    response.id = entity.getId().value;
    response.purchase_order_id = Number(entity.purchase_order_id);
    response.purchase_request_item_id = Number(entity.purchase_request_item_id);
    response.budget_item_id = Number(entity.budget_item_id);
    response.remark = entity.remark;
    response.quantity = entity.quantity;
    response.price = Number(entity.price);
    response.total = Number(entity.total);
    response.vat_total = Number(entity.vat_total);
    response.total_with_vat = Number(entity.total_with_vat);
    response.is_vat = entity.is_vat;
    response.created_at = moment
      .tz(entity.createdAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);
    response.updated_at = moment
      .tz(entity.updatedAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);

    response.budget_item = entity.budgetItem
      ? this._budgetItem.toResponse(entity.budgetItem)
      : null;

    response.purchase_request_item = entity.purchase_request_item
      ? this._purchaseRequestItem.toResponse(entity.purchase_request_item)
      : null;

    response.selected_vendor = entity.selectedVendor
      ? entity.selectedVendor.map((vendor) =>
          this._selectedVendorMapper.toResponse(vendor),
        )
      : null;

    return response;
  }
}
