import { BudgetItemEntity } from '@src/modules/manage/domain/entities/budget-item.entity';
import { ReportPurchaseOrderItemId } from '../value-objects/report-purchase-order-item-id.vo';
import { PurchaseOrderSelectedVendorEntity } from '@src/modules/manage/domain/entities/purchase-order-selected-vendor.entity';
import { PurchaseRequestItemEntity } from '@src/modules/manage/domain/entities/purchase-request-item.entity';
import { ReportPurchaseOrderItemEntity } from '../entities/report-purchase-order-item.entity';

export class ReportPurchaseOrderItemBuilder {
  purchaseOrderItemId: ReportPurchaseOrderItemId;
  purchase_order_id: number;
  purchase_request_item_id: number;
  budget_item_id: number;
  remark: string;
  quantity: number;
  price: number;
  total: number;
  is_vat: boolean;
  vat: number;
  createdAt!: Date;
  updatedAt!: Date | null;
  deletedAt!: Date | null;
  vat_total: number | 0;
  total_with_vat: number | 0;
  budgetItem: BudgetItemEntity | null;
  selectedVendor: PurchaseOrderSelectedVendorEntity[] | null;
  purchase_request_item: PurchaseRequestItemEntity | null;

  setPurchaseOrderItemId(value: ReportPurchaseOrderItemId): this {
    this.purchaseOrderItemId = value;
    return this;
  }

  setPurchaseOrderId(purchase_order_id: number): this {
    this.purchase_order_id = purchase_order_id;
    return this;
  }

  setPurchaseRequestItemId(value: number): this {
    this.purchase_request_item_id = value;
    return this;
  }

  setBudgetItemId(budget_item_id: number): this {
    this.budget_item_id = budget_item_id;
    return this;
  }

  setRemark(remark: string): this {
    this.remark = remark;
    return this;
  }

  setQuantity(quantity: number): this {
    this.quantity = quantity;
    return this;
  }

  setPrice(price: number): this {
    this.price = price;
    return this;
  }

  setTotal(total: number): this {
    this.total = total;
    return this;
  }

  setIsVat(is_vat: boolean): this {
    this.is_vat = is_vat;
    return this;
  }

  setVat(vat: number): this {
    this.vat = vat;
    return this;
  }

  setCreatedAt(createdAt: Date): this {
    this.createdAt = createdAt;
    return this;
  }

  setUpdatedAt(updatedAt: Date | null): this {
    this.updatedAt = updatedAt;
    return this;
  }

  setDeletedAt(deletedAt: Date | null): this {
    this.deletedAt = deletedAt;
    return this;
  }

  setVatTotal(vat_total: number | 0): this {
    this.vat_total = vat_total;
    return this;
  }

  setTotalWithVat(total_with_vat: number | 0): this {
    this.total_with_vat = total_with_vat;
    return this;
  }

  setPurchaseRequestItem(
    purchase_request_item: PurchaseRequestItemEntity | null,
  ): this {
    this.purchase_request_item = purchase_request_item;
    return this;
  }

  setSelectedVendor(
    selectedVendor: PurchaseOrderSelectedVendorEntity[] | null,
  ): this {
    this.selectedVendor = selectedVendor;
    return this;
  }

  setBudgetItem(budgetItem: BudgetItemEntity | null): this {
    this.budgetItem = budgetItem;
    return this;
  }

  build(): ReportPurchaseOrderItemEntity {
    return ReportPurchaseOrderItemEntity.create(this);
  }
}
