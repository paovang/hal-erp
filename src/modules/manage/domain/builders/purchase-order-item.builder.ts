import { BudgetItemDetailEntity } from '../entities/budget-item-detail.entity';
import { PurchaseOrderItemQuoteEntity } from '../entities/purchase-order-item-quote.entity';
import { PurchaseOrderItemEntity } from '../entities/purchase-order-item.entity';
import { PurchaseOrderItemId } from '../value-objects/purchase-order-item-id.vo';

export class PurchaseOrderItemBuilder {
  purchaseOrderItemId: PurchaseOrderItemId;
  purchase_order_id: number;
  purchase_request_item_id: number;
  budget_item_detail_id: number;
  remark: string;
  createdAt!: Date;
  updatedAt!: Date | null;
  deletedAt!: Date | null;
  quote: PurchaseOrderItemQuoteEntity[] | null;
  budgetItemDetail: BudgetItemDetailEntity | null;

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

  setBudgetItemDetailId(budget_item_detail_id: number): this {
    this.budget_item_detail_id = budget_item_detail_id;
    return this;
  }

  setRemark(remark: string): this {
    this.remark = remark;
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

  setQuote(quote: PurchaseOrderItemQuoteEntity[] | null): this {
    this.quote = quote;
    return this;
  }

  setBudgetItemDetail(budgetItemDetail: BudgetItemDetailEntity | null): this {
    this.budgetItemDetail = budgetItemDetail;
    return this;
  }

  build(): PurchaseOrderItemEntity {
    return PurchaseOrderItemEntity.create(this);
  }
}
