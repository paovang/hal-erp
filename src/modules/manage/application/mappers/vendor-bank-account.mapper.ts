import { Injectable } from '@nestjs/common';
import { CreateVendorBankAccountDto } from '../dto/create/vendorBankAccount/create.dto';
import { VendorBankAccountEntity } from '../../domain/entities/vendor-bank-account.entity';
import moment from 'moment-timezone';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { VendorBankAccountResponse } from '../dto/response/vendor-bank-account.response';
import { VendorDataMapper } from './vendor.mapper';
import { CurrencyDataMapper } from './currency.mapper';
import { UpdateVendorBankAccountDto } from '../dto/create/vendorBankAccount/update.dto';

@Injectable()
export class VendorBankAccountDataMapper {
  constructor(
    private readonly vendorMapper: VendorDataMapper,
    private readonly currencyMapper: CurrencyDataMapper,
  ) {}
  /** Mapper Dto To Entity */
  toEntity(
    dto: CreateVendorBankAccountDto | UpdateVendorBankAccountDto,
  ): VendorBankAccountEntity {
    const builder = VendorBankAccountEntity.builder();

    if (dto.vendor_id) {
      builder.setVendorId(dto.vendor_id);
    }

    if (dto.currency_id) {
      builder.setCurrencyId(dto.currency_id);
    }

    if (dto.account_name) {
      builder.setAccountName(dto.account_name);
    }

    if (dto.bank_name) {
      builder.setBankName(dto.bank_name);
    }

    if (dto.account_number) {
      builder.setAccountNumber(dto.account_number);
    }

    return builder.build();
  }

  /** Mapper Entity To Response */
  toResponse(entity: VendorBankAccountEntity): VendorBankAccountResponse {
    const response = new VendorBankAccountResponse();
    response.id = Number(entity.getId().value);
    response.vendor_id = Number(entity.vendorID ?? null);
    response.currency_id = entity.currencyID ?? null;
    response.account_name = entity.accountName;
    response.bank_name = entity.bankName;
    response.account_number = entity.accountNumber;
    response.is_selected = entity.isSelected;
    response.created_at = moment
      .tz(entity.createdAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);
    response.updated_at = moment
      .tz(entity.updatedAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);

    response.vendor = entity.vendor
      ? this.vendorMapper.toResponse(entity.vendor)
      : null;

    response.currency = entity.currency
      ? this.currencyMapper.toResponse(entity.currency)
      : null;

    return response;
  }
}
