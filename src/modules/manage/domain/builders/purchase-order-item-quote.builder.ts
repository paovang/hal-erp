import { PurchaseOrderItemQuoteEntity } from '../entities/purchase-order-item-quote.entity';
import { VendorBankAccountEntity } from '../entities/vendor-bank-account.entity';
import { VendorEntity } from '../entities/vendor.entity';
import { PurchaseOrderItemQuoteId } from '../value-objects/purchase-order-item-quote-id.vo';

export class PurchaseOrderItemQuoteBuilder {
  purchaseOrderItemQuoteId: PurchaseOrderItemQuoteId;
  purchase_order_item_id: number;
  vendor_id: number;
  price: number;
  total: number;
  is_selected: boolean;
  createdAt!: Date;
  updatedAt!: Date | null;
  deletedAt!: Date | null;
  vendor: VendorEntity | null;
  vendor_bank_account: VendorBankAccountEntity[] | null;

  setPurchaseOrderItemQuoteId(value: PurchaseOrderItemQuoteId): this {
    this.purchaseOrderItemQuoteId = value;
    return this;
  }

  setPurchaseOrderItemId(purchase_order_item_id: number): this {
    this.purchase_order_item_id = purchase_order_item_id;
    return this;
  }

  setVendorId(vendor_id: number): this {
    this.vendor_id = vendor_id;
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

  setIsSelected(is_selected: boolean): this {
    this.is_selected = is_selected;
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

  setVendor(vendor: VendorEntity | null): this {
    this.vendor = vendor;
    return this;
  }

  setVendorBankAccount(
    vendor_bank_account: VendorBankAccountEntity[] | null,
  ): this {
    this.vendor_bank_account = vendor_bank_account;
    return this;
  }

  build(): PurchaseOrderItemQuoteEntity {
    return PurchaseOrderItemQuoteEntity.create(this);
  }
}
