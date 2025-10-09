// import { Injectable } from '@nestjs/common';
// import { PurchaseOrderItemQuoteEntity } from '../../domain/entities/purchase-order-item-quote.entity';
// import { PurchaseOrderItemQuoteId } from '../../domain/value-objects/purchase-order-item-quote-id.vo';

// import { VendorDataAccessMapper } from './vendor.mapper';
// import { VendorBankAccountDataAccessMapper } from './vendor-bank-account.mapper';
// import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';
// import moment from 'moment-timezone';
// import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
// import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';

// @Injectable()
// export class PurchaseOrderItemQuoteDataAccessMapper {
//   constructor(
//     private readonly _vendor: VendorDataAccessMapper,
//     private readonly _vendorBankAccount: VendorBankAccountDataAccessMapper,
//   ) {}

//   toOrmEntity(
//     pOIQEntity: PurchaseOrderItemQuoteEntity,
//     method: OrmEntityMethod,
//   ): PurchaseOrderItemQuoteOrmEntity {
//     const now = moment.tz(Timezone.LAOS).format(DateFormat.DATETIME_FORMAT);
//     const id = pOIQEntity.getId();

//     const mediaOrmEntity = new PurchaseOrderItemQuoteOrmEntity();
//     if (id) {
//       mediaOrmEntity.id = id.value;
//     }

//     mediaOrmEntity.purchase_order_item_id = pOIQEntity.purchase_order_item_id;
//     mediaOrmEntity.vendor_id = pOIQEntity.vendor_id;
//     if (method === OrmEntityMethod.CREATE) {
//       mediaOrmEntity.price = pOIQEntity.price;
//       mediaOrmEntity.total = pOIQEntity.total;
//     }
//     mediaOrmEntity.is_selected = pOIQEntity.is_selected
//       ? SelectStatus.TRUE
//       : SelectStatus.FALSE;

//     if (method === OrmEntityMethod.CREATE) {
//       mediaOrmEntity.created_at = pOIQEntity.createdAt ?? new Date(now);
//     }
//     mediaOrmEntity.updated_at = new Date(now);

//     return mediaOrmEntity;
//   }

//   toEntity(
//     ormData: PurchaseOrderItemQuoteOrmEntity,
//   ): PurchaseOrderItemQuoteEntity {
//     const builder = PurchaseOrderItemQuoteEntity.builder()
//       .setPurchaseOrderItemQuoteId(new PurchaseOrderItemQuoteId(ormData.id))
//       .setPurchaseOrderItemId(ormData.purchase_order_item_id ?? 0)
//       .setVendorId(ormData.vendor_id ?? 0)
//       .setPrice(ormData.price ?? 0)
//       .setTotal(ormData.total ?? 0)
//       //   .setIsSelected(Boolean(ormData.is_selected))
//       .setIsSelected(
//         (ormData.is_selected as SelectStatus) === SelectStatus.TRUE
//           ? true
//           : false,
//       )
//       .setCreatedAt(ormData.created_at)
//       .setUpdatedAt(ormData.updated_at);

//     if (ormData.vendors) {
//       builder.setVendor(this._vendor.toEntity(ormData.vendors));
//     }

//     if (ormData.vendors && ormData.vendors.vendor_bank_accounts) {
//       const vendorBankAccounts = ormData.vendors.vendor_bank_accounts.map(
//         (vendorBankAccount) =>
//           this._vendorBankAccount.toEntity(vendorBankAccount),
//       );
//       builder.setVendorBankAccount(vendorBankAccounts);
//     }
//     return builder.build();
//   }
// }
