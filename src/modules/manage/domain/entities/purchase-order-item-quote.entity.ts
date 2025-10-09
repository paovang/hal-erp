import { Entity } from '@src/common/domain/entities/entity';
import { PurchaseOrderItemQuoteId } from '../value-objects/purchase-order-item-quote-id.vo';
import { PurchaseOrderItemQuoteBuilder } from '../builders/purchase-order-item-quote.builder';
import { BadRequestException } from '@nestjs/common';
import { VendorEntity } from './vendor.entity';
import { VendorBankAccountEntity } from './vendor-bank-account.entity';

export class PurchaseOrderItemQuoteEntity extends Entity<PurchaseOrderItemQuoteId> {
  private readonly _purchase_order_item_id: number;
  private readonly _vendor_id: number;
  private readonly _price: number;
  private readonly _total: number;
  private readonly _is_selected: boolean;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date | null;
  private readonly _deletedAt: Date | null;
  private readonly _vendor: VendorEntity | null;
  private readonly _vendor_bank_account: VendorBankAccountEntity[] | null;

  private constructor(builder: PurchaseOrderItemQuoteBuilder) {
    super();
    this.setId(builder.purchaseOrderItemQuoteId);
    this._purchase_order_item_id = builder.purchase_order_item_id;
    this._vendor_id = builder.vendor_id;
    this._price = builder.price;
    this._total = builder.total;
    this._is_selected = builder.is_selected;
    this._createdAt = builder.createdAt;
    this._updatedAt = builder.updatedAt ?? null;
    this._deletedAt = builder.deletedAt ?? null;
    this._vendor = builder.vendor ?? null;
    this._vendor_bank_account = builder.vendor_bank_account ?? null;
  }

  get purchase_order_item_id(): number {
    return this._purchase_order_item_id;
  }

  get vendor_id(): number {
    return this._vendor_id;
  }

  get price(): number {
    return this._price;
  }

  get total(): number {
    return this._total;
  }

  get is_selected(): boolean {
    return this._is_selected;
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

  get vendor(): VendorEntity | null {
    return this._vendor;
  }

  get vendor_bank_account(): VendorBankAccountEntity[] | null {
    return this._vendor_bank_account;
  }

  public static builder(): PurchaseOrderItemQuoteBuilder {
    return new PurchaseOrderItemQuoteBuilder();
  }

  static create(
    builder: PurchaseOrderItemQuoteBuilder,
  ): PurchaseOrderItemQuoteEntity {
    return new PurchaseOrderItemQuoteEntity(builder);
  }

  static getEntityName() {
    return 'purchase_order_item_quote';
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
    purchaseOrderItemQuoteId: PurchaseOrderItemQuoteId,
  ) {
    this.setId(purchaseOrderItemQuoteId);
  }
}
