import { Entity } from '@src/common/domain/entities/entity';
import { PurchaseOrderItemId } from '../value-objects/purchase-order-item-id.vo';
import { BadRequestException } from '@nestjs/common';
import { PurchaseOrderItemBuilder } from '../builders/purchase-order-item.builder';
import { PurchaseOrderItemQuoteEntity } from './purchase-order-item-quote.entity';
import { BudgetItemDetailEntity } from './budget-item-detail.entity';

export class PurchaseOrderItemEntity extends Entity<PurchaseOrderItemId> {
  private readonly _purchase_order_id: number;
  private readonly _purchase_request_item_id: number;
  private readonly _budget_item_detail_id: number;
  private readonly _remark: string;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date | null;
  private readonly _deletedAt: Date | null;
  private readonly _quote: PurchaseOrderItemQuoteEntity[] | null;
  private readonly _budgetItemDetail: BudgetItemDetailEntity | null;

  private constructor(builder: PurchaseOrderItemBuilder) {
    super();
    this.setId(builder.purchaseOrderItemId);
    this._purchase_order_id = builder.purchase_order_id;
    this._purchase_request_item_id = builder.purchase_request_item_id;
    this._budget_item_detail_id = builder.budget_item_detail_id;
    this._remark = builder.remark;
    this._createdAt = builder.createdAt;
    this._updatedAt = builder.updatedAt ?? null;
    this._deletedAt = builder.deletedAt ?? null;
    this._quote = builder.quote ?? null;
    this._budgetItemDetail = builder.budgetItemDetail ?? null;
  }

  get purchase_order_id(): number {
    return this._purchase_order_id;
  }

  get purchase_request_item_id(): number {
    return this._purchase_request_item_id;
  }

  get budget_item_detail_id(): number {
    return this._budget_item_detail_id;
  }

  get remark(): string {
    return this._remark;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date | null {
    return this._updatedAt;
  }

  get deletedAt(): Date | null {
    return this._deletedAt;
  }

  get budgetItemDetail(): BudgetItemDetailEntity | null {
    return this._budgetItemDetail;
  }

  get quote(): PurchaseOrderItemQuoteEntity[] | null {
    return this._quote;
  }

  public static builder(): PurchaseOrderItemBuilder {
    return new PurchaseOrderItemBuilder();
  }

  static create(builder: PurchaseOrderItemBuilder): PurchaseOrderItemEntity {
    return new PurchaseOrderItemEntity(builder);
  }

  static getEntityName() {
    return 'purchase_order_item';
  }

  async validateExistingIdForUpdate() {
    if (!this.getId()) {
      console.log('phoudvang');
      throw new BadRequestException(
        'users.user_is_not_in_correct_state_for_initialization',
      );
    }
  }

  async initializeUpdateSetId(purchaseOrderItemID: PurchaseOrderItemId) {
    this.setId(purchaseOrderItemID);
  }
}
