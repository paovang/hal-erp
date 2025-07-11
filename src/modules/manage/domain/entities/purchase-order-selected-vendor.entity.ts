import { Entity } from '@src/common/domain/entities/entity';
import { PurchaseOrderSelectedVendorId } from '../value-objects/purchase-order-selected-vendor-id.vo';
import { PurchaseOrderSelectedVendorBuilder } from '../builders/purchase-order-selected-vendor.builder';
import { BadRequestException } from '@nestjs/common';
import { VendorEntity } from './vendor.entity';
import { VendorBankAccountEntity } from './vendor-bank-account.entity';

export class PurchaseOrderSelectedVendorEntity extends Entity<PurchaseOrderSelectedVendorId> {
  private readonly _purchase_order_item_id: number;
  private readonly _vendor_id: number;
  private readonly _filename: string;
  private readonly _reason: string;
  private readonly _selected: boolean;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date | null;
  private readonly _deletedAt: Date | null;
  private readonly _vendor: VendorEntity | null;
  private readonly _vendor_bank_account: VendorBankAccountEntity[] | null;

  private constructor(builder: PurchaseOrderSelectedVendorBuilder) {
    super();
    this.setId(builder.purchaseOrderSelectedVendorId);
    this._purchase_order_item_id = builder.purchase_order_item_id;
    this._vendor_id = builder.vendor_id;
    this._filename = builder.filename;
    this._reason = builder.reason;
    this._selected = builder.selected;
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

  get filename(): string {
    return this._filename;
  }

  get reason(): string {
    return this._reason;
  }

  get selected(): boolean {
    return this._selected;
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

  public static builder(): PurchaseOrderSelectedVendorBuilder {
    return new PurchaseOrderSelectedVendorBuilder();
  }

  static create(
    builder: PurchaseOrderSelectedVendorBuilder,
  ): PurchaseOrderSelectedVendorEntity {
    return new PurchaseOrderSelectedVendorEntity(builder);
  }

  static getEntityName() {
    return 'purchase_order_selected_vendor';
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
    purchaseOrderSelectedVendorId: PurchaseOrderSelectedVendorId,
  ) {
    this.setId(purchaseOrderSelectedVendorId);
  }
}
