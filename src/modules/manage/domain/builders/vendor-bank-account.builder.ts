import { CurrencyEntity } from '../entities/currency.entity';
import { VendorBankAccountEntity } from '../entities/vendor-bank-account.entity';
import { VendorEntity } from '../entities/vendor.entity';
import { VendorBankAccountId } from '../value-objects/vendor-bank-account-id.vo';

export class VendorBankAccountBuilder {
  vendorBankAccountId: VendorBankAccountId;
  vendor_id: number;
  currency_id: number;
  bank_name: string;
  account_name: string;
  account_number: string;
  is_selected: boolean;
  createdAt!: Date;
  updatedAt!: Date | null;
  deletedAt!: Date | null;
  vendor: VendorEntity;
  currency: CurrencyEntity;

  setVendorBankAccountId(value: VendorBankAccountId): this {
    this.vendorBankAccountId = value;
    return this;
  }

  setVendorId(value: number): this {
    this.vendor_id = value;
    return this;
  }

  setCurrencyId(value: number): this {
    this.currency_id = value;
    return this;
  }

  setBankName(bank_name: string): this {
    this.bank_name = bank_name;
    return this;
  }

  setAccountName(account_name: string): this {
    this.account_name = account_name;
    return this;
  }

  setAccountNumber(account_number: string): this {
    this.account_number = account_number;
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

  setVendor(vendor: VendorEntity): this {
    this.vendor = vendor;
    return this;
  }

  setCurrency(currency: CurrencyEntity): this {
    this.currency = currency;
    return this;
  }

  build(): VendorBankAccountEntity {
    return VendorBankAccountEntity.create(this);
  }
}
