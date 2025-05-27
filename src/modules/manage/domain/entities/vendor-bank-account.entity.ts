import { Entity } from '@src/common/domain/entities/entity';
import { VendorBankAccountId } from '../value-objects/vendor-bank-account-id.vo';
import { VendorBankAccountBuilder } from '../builders/vendor-bank-account.builder';
import { BadRequestException } from '@nestjs/common';
import { VendorEntity } from './vendor.entity';
import { CurrencyEntity } from './currency.entity';

export class VendorBankAccountEntity extends Entity<VendorBankAccountId> {
  private readonly _vendorID: number;
  private readonly _currencyID: number;
  private readonly _bankName: string;
  private readonly _accountName: string;
  private readonly _accountNumber: string;
  private readonly _is_selected: boolean;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date | null;
  private readonly _deletedAt: Date | null;
  private readonly _vendor: VendorEntity;
  private readonly _currency: CurrencyEntity;

  private constructor(builder: VendorBankAccountBuilder) {
    super();
    this.setId(builder.vendorBankAccountId);
    this._vendorID = builder.vendor_id;
    this._currencyID = builder.currency_id;
    this._bankName = builder.bank_name;
    this._accountName = builder.account_name;
    this._accountNumber = builder.account_number;
    this._is_selected = builder.is_selected;
    this._createdAt = builder.createdAt;
    this._updatedAt = builder.updatedAt ?? null;
    this._deletedAt = builder.deletedAt ?? null;
    this._vendor = builder.vendor;
    this._currency = builder.currency;
  }

  get vendorID(): number {
    return this._vendorID;
  }

  get currencyID(): number {
    return this._currencyID;
  }

  get bankName(): string {
    return this._bankName;
  }

  get accountName(): string {
    return this._accountName;
  }

  get accountNumber(): string {
    return this._accountNumber;
  }

  get isSelected(): boolean {
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

  get vendor(): VendorEntity {
    return this._vendor;
  }

  get currency(): CurrencyEntity {
    return this._currency;
  }

  public static builder(): VendorBankAccountBuilder {
    return new VendorBankAccountBuilder();
  }

  static create(builder: VendorBankAccountBuilder): VendorBankAccountEntity {
    return new VendorBankAccountEntity(builder);
  }

  static getEntityName() {
    return 'unit';
  }

  async validateExistingIdForUpdate() {
    if (!this.getId()) {
      console.log('phoudvang');
      throw new BadRequestException(
        'users.user_is_not_in_correct_state_for_initialization',
      );
    }
  }

  async initializeUpdateSetId(vendorBankAccountID: VendorBankAccountId) {
    this.setId(vendorBankAccountID);
  }
}
