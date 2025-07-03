import { Injectable } from '@nestjs/common';
import { PurchaseOrderItemQuoteEntity } from '../../domain/entities/purchase-order-item-quote.entity';
import { PurchaseOrderItemQuoteId } from '../../domain/value-objects/purchase-order-item-quote-id.vo';
import {
  PurchaseOrderItemQuoteOrmEntity,
  SelectStatus,
} from '@src/common/infrastructure/database/typeorm/purchase-order-item-quote.orm';
import { VendorDataAccessMapper } from './vendor.mapper';
import { VendorBankAccountDataAccessMapper } from './vendor-bank-account.mapper';

@Injectable()
export class PurchaseOrderItemQuoteDataAccessMapper {
  constructor(
    private readonly _vendor: VendorDataAccessMapper,
    private readonly _vendorBankAccount: VendorBankAccountDataAccessMapper,
  ) {}
  toEntity(
    ormData: PurchaseOrderItemQuoteOrmEntity,
  ): PurchaseOrderItemQuoteEntity {
    const builder = PurchaseOrderItemQuoteEntity.builder()
      .setPurchaseOrderItemQuoteId(new PurchaseOrderItemQuoteId(ormData.id))
      .setPurchaseOrderItemId(ormData.purchase_order_item_id ?? 0)
      .setVendorId(ormData.vendor_id ?? 0)
      .setPrice(ormData.price ?? 0)
      .setTotal(ormData.total ?? 0)
      //   .setIsSelected(Boolean(ormData.is_selected))
      .setIsSelected(
        (ormData.is_selected as SelectStatus) === SelectStatus.TRUE
          ? true
          : false,
      )
      .setCreatedAt(ormData.created_at)
      .setUpdatedAt(ormData.updated_at);

    if (ormData.vendors) {
      builder.setVendor(this._vendor.toEntity(ormData.vendors));
    }

    if (ormData.vendors.vendor_bank_accounts) {
      const vendorBankAccounts = ormData.vendors.vendor_bank_accounts.map(
        (vendorBankAccount) =>
          this._vendorBankAccount.toEntity(vendorBankAccount),
      );
      builder.setVendorBankAccount(vendorBankAccounts);
    }
    return builder.build();
  }
}
