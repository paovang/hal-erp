import { PurchaseOrderSelectedVendorEntity } from '../entities/purchase-order-selected-vendor.entity';
import { VendorBankAccountEntity } from '../entities/vendor-bank-account.entity';
import { VendorEntity } from '../entities/vendor.entity';
import { PurchaseOrderSelectedVendorId } from '../value-objects/purchase-order-selected-vendor-id.vo';

export class PurchaseOrderSelectedVendorBuilder {
  purchaseOrderSelectedVendorId: PurchaseOrderSelectedVendorId;
  purchase_order_id: number;
  vendor_id: number;
  filename: string;
  reason: string;
  createdAt!: Date;
  updatedAt!: Date | null;
  deletedAt!: Date | null;
  vendor: VendorEntity | null;
  vendor_bank_account: VendorBankAccountEntity[] | null;

  setPurchaseOrderSelectedVendorId(value: PurchaseOrderSelectedVendorId): this {
    this.purchaseOrderSelectedVendorId = value;
    return this;
  }

  setPurchaseOrderId(purchase_order_id: number): this {
    this.purchase_order_id = purchase_order_id;
    return this;
  }

  setVendorId(vendor_id: number): this {
    this.vendor_id = vendor_id;
    return this;
  }

  setFilename(filename: string): this {
    this.filename = filename;
    return this;
  }

  setReason(reason: string): this {
    this.reason = reason;
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

  build(): PurchaseOrderSelectedVendorEntity {
    return PurchaseOrderSelectedVendorEntity.create(this);
  }
}
