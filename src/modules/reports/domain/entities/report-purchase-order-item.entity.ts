import { Entity } from '@src/common/domain/entities/entity';
import { ReportPurchaseOrderItemId } from '../value-objects/report-purchase-order-item-id.vo';
import { PurchaseRequestItemEntity } from '@src/modules/manage/domain/entities/purchase-request-item.entity';
import { BudgetItemEntity } from '@src/modules/manage/domain/entities/budget-item.entity';
import { PurchaseOrderSelectedVendorEntity } from '@src/modules/manage/domain/entities/purchase-order-selected-vendor.entity';
import { ReportPurchaseOrderItemBuilder } from '../builders/report-purchase-order-item.builder';
import { BadRequestException } from '@nestjs/common';

export class ReportPurchaseOrderItemEntity extends Entity<ReportPurchaseOrderItemId> {
  private readonly _purchase_order_id: number;
  private readonly _purchase_request_item_id: number;
  private readonly _budget_item_id: number;
  private readonly _remark: string;
  private readonly _quantity: number;
  private readonly _price: number;
  private readonly _total: number;
  private readonly _is_vat: boolean;
  private readonly _vat: number;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date | null;
  private readonly _deletedAt: Date | null;
  private readonly _vat_total: number | 0;
  private readonly _total_with_vat: number | 0;
  private readonly _purchase_request_item: PurchaseRequestItemEntity | null;
  private readonly _budgetItem: BudgetItemEntity | null;
  private readonly _selectedVendor: PurchaseOrderSelectedVendorEntity[] | null;

  private constructor(builder: ReportPurchaseOrderItemBuilder) {
    super();
    this.setId(builder.purchaseOrderItemId);
    this._purchase_order_id = builder.purchase_order_id;
    this._purchase_request_item_id = builder.purchase_request_item_id;
    this._budget_item_id = builder.budget_item_id;
    this._remark = builder.remark;
    this._quantity = builder.quantity;
    this._price = builder.price;
    this._total = builder.total;
    this._is_vat = builder.is_vat;
    this._vat = builder.vat;
    this._createdAt = builder.createdAt;
    this._updatedAt = builder.updatedAt ?? null;
    this._deletedAt = builder.deletedAt ?? null;
    this._vat_total = builder.vat_total;
    this._total_with_vat = builder.total_with_vat;
    this._budgetItem = builder.budgetItem ?? null;
    this._selectedVendor = builder.selectedVendor ?? null;
    this._purchase_request_item = builder.purchase_request_item ?? null;
  }

  get purchase_order_id(): number {
    return this._purchase_order_id;
  }

  get purchase_request_item_id(): number {
    return this._purchase_request_item_id;
  }

  get budget_item_id(): number {
    return this._budget_item_id;
  }

  get remark(): string {
    return this._remark;
  }

  get quantity(): number {
    return this._quantity;
  }

  get price(): number {
    return this._price;
  }

  get total(): number {
    return this._total;
  }

  get is_vat(): boolean {
    return this._is_vat;
  }

  get vat(): number {
    return this._vat;
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

  get vat_total(): number | 0 {
    return this._vat_total;
  }

  get total_with_vat(): number | 0 {
    return this._total_with_vat;
  }

  get budgetItem(): BudgetItemEntity | null {
    return this._budgetItem;
  }
  get purchase_request_item(): PurchaseRequestItemEntity | null {
    return this._purchase_request_item;
  }

  get selectedVendor(): PurchaseOrderSelectedVendorEntity[] | null {
    return this._selectedVendor;
  }

  public static builder(): ReportPurchaseOrderItemBuilder {
    return new ReportPurchaseOrderItemBuilder();
  }

  static create(
    builder: ReportPurchaseOrderItemBuilder,
  ): ReportPurchaseOrderItemEntity {
    return new ReportPurchaseOrderItemEntity(builder);
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

  async initializeUpdateSetId(
    reportPurchaseOrderItemID: ReportPurchaseOrderItemId,
  ) {
    this.setId(reportPurchaseOrderItemID);
  }
}
