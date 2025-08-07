import { BudgetItemEntity } from '../entities/budget-item.entity';
import { PurchaseOrderItemEntity } from '../entities/purchase-order-item.entity';
import { PurchaseOrderSelectedVendorEntity } from '../entities/purchase-order-selected-vendor.entity';
import { PurchaseOrderItemId } from '../value-objects/purchase-order-item-id.vo';

export class PurchaseOrderItemBuilder {
  purchaseOrderItemId: PurchaseOrderItemId;
  purchase_order_id: number;
  purchase_request_item_id: number;
  budget_item_id: number;
  remark: string;
  quantity: number;
  price: number;
  total: number;
  is_vat: boolean;
  createdAt!: Date;
  updatedAt!: Date | null;
  deletedAt!: Date | null;
  vat_total: number | 0;
  total_with_vat: number | 0;
  // quote: PurchaseOrderItemQuoteEntity[] | null;
  budgetItem: BudgetItemEntity | null;
  selectedVendor: PurchaseOrderSelectedVendorEntity[] | null;

  setPurchaseOrderItemId(value: PurchaseOrderItemId): this {
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

  // setQuote(quote: PurchaseOrderItemQuoteEntity[] | null): this {
  //   this.quote = quote;
  //   return this;
  // }

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

  build(): PurchaseOrderItemEntity {
    return PurchaseOrderItemEntity.create(this);
  }
}
