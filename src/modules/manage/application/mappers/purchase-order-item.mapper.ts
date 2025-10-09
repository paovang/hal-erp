import { Injectable } from '@nestjs/common';
import { PurchaseOrderItemEntity } from '../../domain/entities/purchase-order-item.entity';
import { PurchaseOrderItemResponse } from '../dto/response/purchase-order-item.response';
import moment from 'moment-timezone';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { PurchaseOrderSelectedVendorDataMapper } from './purchase-order-selected-vendor.mapper';
import { UpdatePurchaseOrderBudgetItemDto } from '../dto/create/purchaseOrderItem/update.dto';
import { BudgetItemDataMapper } from './budget-item.mapper';
import { PurchaseRequestItemDataMapper } from './purchase-request-item.mapper';

interface CustomPurchaseOrderItemDto {
  purchase_request_item_id: number;
  remark: string;
  price: number;
  quantity: number;
  total: number;
  is_vat: boolean;
  vat?: number;
}

@Injectable()
export class PurchaseOrderItemDataMapper {
  constructor(
    private readonly _budgetItem: BudgetItemDataMapper,
    private readonly _purchaseRequestItem: PurchaseRequestItemDataMapper,
    private readonly selectedVendorMapper: PurchaseOrderSelectedVendorDataMapper,
  ) {}

  toEntity(
    dto?: CustomPurchaseOrderItemDto,
    po_id?: number,
    budget_item_id?: number,
  ): PurchaseOrderItemEntity {
    const builder = PurchaseOrderItemEntity.builder();
    if (po_id) {
      builder.setPurchaseOrderId(po_id);
    }

    if (dto?.purchase_request_item_id) {
      builder.setPurchaseRequestItemId(dto.purchase_request_item_id);
    }

    if (dto?.remark) {
      builder.setRemark(dto.remark);
    }

    if (dto?.quantity) {
      builder.setQuantity(dto.quantity);
    }

    if (dto?.price) {
      builder.setPrice(dto.price);
    }

    if (dto?.total) {
      builder.setTotal(dto.total);
    }

    if (dto?.is_vat) {
      builder.setIsVat(dto.is_vat);
    }

    if (dto?.vat) {
      builder.setVat(dto.vat);
    }

    if (budget_item_id) {
      builder.setBudgetItemId(budget_item_id);
    }

    return builder.build();
  }

  toEntityForUpdate(
    dto: UpdatePurchaseOrderBudgetItemDto,
  ): PurchaseOrderItemEntity {
    const builder = PurchaseOrderItemEntity.builder();

    if (dto.budget_item_id) {
      builder.setBudgetItemId(dto.budget_item_id);
    }

    return builder.build();
  }

  /** Mapper Entity To Response */
  toResponse(entity: PurchaseOrderItemEntity): PurchaseOrderItemResponse {
    const response = new PurchaseOrderItemResponse();
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
          this.selectedVendorMapper.toResponse(vendor),
        )
      : null;

    return response;
  }
}
