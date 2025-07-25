import { VendorBankAccountOrmEntity } from '@src/common/infrastructure/database/typeorm/vendor_bank_account.orm';
import { VendorBankAccountEntity } from '../../domain/entities/vendor-bank-account.entity';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import moment from 'moment-timezone';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { VendorBankAccountId } from '../../domain/value-objects/vendor-bank-account-id.vo';
import { Injectable } from '@nestjs/common';
import { VendorDataAccessMapper } from './vendor.mapper';
import { CurrencyDataAccessMapper } from './currency.mapper';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';
import { BankDataAccessMapper } from './bank.mapper';

@Injectable()
export class VendorBankAccountDataAccessMapper {
  constructor(
    private readonly vendorMapper: VendorDataAccessMapper,
    private readonly currencyMapper: CurrencyDataAccessMapper,
    private readonly bankMapper: BankDataAccessMapper,
  ) {}
  toOrmEntity(
    vendorBankAccountEntity: VendorBankAccountEntity,
    method: OrmEntityMethod,
  ): VendorBankAccountOrmEntity {
    const now = moment.tz(Timezone.LAOS).format(DateFormat.DATETIME_FORMAT);
    const id = vendorBankAccountEntity.getId();

    const mediaOrmEntity = new VendorBankAccountOrmEntity();
    if (id) {
      mediaOrmEntity.id = id.value;
    }

    mediaOrmEntity.vendor_id = vendorBankAccountEntity.vendorID;
    mediaOrmEntity.currency_id = vendorBankAccountEntity.currencyID;
    mediaOrmEntity.account_name = vendorBankAccountEntity.accountName;
    mediaOrmEntity.account_number = vendorBankAccountEntity.accountNumber;
    mediaOrmEntity.bank_id = vendorBankAccountEntity.bankId;
    mediaOrmEntity.is_selected = vendorBankAccountEntity.isSelected;

    if (method === OrmEntityMethod.CREATE) {
      mediaOrmEntity.created_at =
        vendorBankAccountEntity.createdAt ?? new Date(now);
    }

    mediaOrmEntity.updated_at = new Date(now);

    return mediaOrmEntity;
  }

  toEntity(ormData: VendorBankAccountOrmEntity): VendorBankAccountEntity {
    const builder = VendorBankAccountEntity.builder()
      .setVendorBankAccountId(new VendorBankAccountId(ormData.id))
      .setVendorId(ormData.vendor_id ?? 0)
      .setCurrencyId(ormData.currency_id ?? 0)
      .setAccountName(ormData.account_name)
      .setAccountNumber(ormData.account_number)
      .setBankId(ormData.bank_id ?? 0)
      .setIsSelected(ormData.is_selected)
      .setCreatedAt(ormData.created_at)
      .setUpdatedAt(ormData.updated_at);

    if (ormData.vendors) {
      builder.setVendor(this.vendorMapper.toEntity(ormData.vendors));
    }
    if (ormData.currencies) {
      builder.setCurrency(this.currencyMapper.toEntity(ormData.currencies));
    }
    if (ormData.banks) {
      builder.setBank(this.bankMapper.toEntity(ormData.banks));
    }

    return builder.build();
  }
}
