import { PurchaseOrderSelectedVendorOrmEntity } from '@src/common/infrastructure/database/typeorm/purchase-order-selected-vendor.orm';
import { PurchaseOrderSelectedVendorEntity } from '../../domain/entities/purchase-order-selected-vendor.entity';
import { PurchaseOrderSelectedVendorId } from '../../domain/value-objects/purchase-order-selected-vendor-id.vo';
import { Injectable } from '@nestjs/common';
import { VendorDataAccessMapper } from './vendor.mapper';
import { VendorBankAccountDataAccessMapper } from './vendor-bank-account.mapper';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';
import moment from 'moment-timezone';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { SelectStatus } from '../../application/constants/status-key.const';

@Injectable()
export class PurchaseOrderSelectedVendorDataAccessMapper {
  constructor(
    private readonly _vendor: VendorDataAccessMapper,
    private readonly _vendorBankAccount: VendorBankAccountDataAccessMapper,
  ) {}

  toOrmEntity(
    svEntity: PurchaseOrderSelectedVendorEntity,
    method: OrmEntityMethod,
  ): PurchaseOrderSelectedVendorOrmEntity {
    const now = moment.tz(Timezone.LAOS).format(DateFormat.DATETIME_FORMAT);
    const id = svEntity.getId();

    const mediaOrmEntity = new PurchaseOrderSelectedVendorOrmEntity();
    if (id) {
      mediaOrmEntity.id = id.value;
    }

    mediaOrmEntity.purchase_order_item_id = svEntity.purchase_order_item_id;
    mediaOrmEntity.vendor_bank_account_id = svEntity.vendor_bank_account_id;
    mediaOrmEntity.vendor_id = svEntity.vendor_id;
    mediaOrmEntity.filename = svEntity.filename;
    mediaOrmEntity.reason = svEntity.reason;
    mediaOrmEntity.is_selected = svEntity.selected
      ? SelectStatus.TRUE
      : SelectStatus.FALSE;
    if (method === OrmEntityMethod.CREATE) {
      mediaOrmEntity.created_at = svEntity.createdAt ?? new Date(now);
    }
    mediaOrmEntity.updated_at = new Date(now);

    return mediaOrmEntity;
  }

  toEntity(
    ormData: PurchaseOrderSelectedVendorOrmEntity,
  ): PurchaseOrderSelectedVendorEntity {
    const builder = PurchaseOrderSelectedVendorEntity.builder()
      .setPurchaseOrderSelectedVendorId(
        new PurchaseOrderSelectedVendorId(ormData.id),
      )
      .setPurchaseOrderItemId(ormData.purchase_order_item_id ?? 0)
      .setVendorId(ormData.vendor_id ?? 0)
      .setFilename(ormData.filename ?? '')
      .setReason(ormData.reason ?? '')
      .setSelected(
        (ormData.is_selected as SelectStatus) === SelectStatus.TRUE
          ? true
          : false,
      )
      .setCreatedAt(ormData.created_at)
      .setUpdatedAt(ormData.updated_at);

    if (ormData.vendors) {
      builder.setVendor(this._vendor.toEntity(ormData.vendors));
    }

    if (ormData.vendor_bank_account) {
      builder.setVendorBankAccount(
        this._vendorBankAccount.toEntity(ormData.vendor_bank_account),
      );
    }

    return builder.build();
  }
}
