// import { Injectable } from '@nestjs/common';
// import { PurchaseOrderItemQuoteEntity } from '../../domain/entities/purchase-order-item-quote.entity';
// import { PurchaseOrderItemQuoteResponse } from '../dto/response/purchase-order-item-quote.response';
// import moment from 'moment-timezone';
// import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
// import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
// import { VendorDataMapper } from './vendor.mapper';
// import { VendorBankAccountDataMapper } from './vendor-bank-account.mapper';

// interface CustomPurchaseOrderItemQuoteDto {
//   purchase_order_item_id: number;
//   vendor_id: number;
//   price: number;
//   total: number;
//   is_selected: boolean;
// }
// @Injectable()
// export class PurchaseOrderItemQuoteDataMapper {
//   constructor(
//     private readonly _vendor: VendorDataMapper,
//     private readonly _vendorBankAccount: VendorBankAccountDataMapper,
//   ) {}

//   toEntity(dto: CustomPurchaseOrderItemQuoteDto): PurchaseOrderItemQuoteEntity {
//     const builder = PurchaseOrderItemQuoteEntity.builder();

//     if (dto.purchase_order_item_id) {
//       builder.setPurchaseOrderItemId(dto.purchase_order_item_id);
//     }

//     if (dto.vendor_id) {
//       builder.setVendorId(dto.vendor_id);
//     }

//     if (dto.price) {
//       builder.setPrice(dto.price);
//     }

//     if (dto.total) {
//       builder.setTotal(dto.total);
//     }

//     if (dto.is_selected) {
//       builder.setIsSelected(dto.is_selected);
//     }

//     return builder.build();
//   }

//   /** Mapper Entity To Response */
//   toResponse(
//     entity: PurchaseOrderItemQuoteEntity,
//   ): PurchaseOrderItemQuoteResponse {
//     const response = new PurchaseOrderItemQuoteResponse();
//     response.id = Number(entity.getId().value);
//     response.purchase_order_item_id = Number(entity.purchase_order_item_id);
//     response.vendor_id = Number(entity.vendor_id);
//     response.price = entity.price;
//     response.total = entity.total;
//     response.is_selected = entity.is_selected;
//     response.created_at = moment
//       .tz(entity.createdAt, Timezone.LAOS)
//       .format(DateFormat.DATETIME_READABLE_FORMAT);
//     response.updated_at = moment
//       .tz(entity.updatedAt, Timezone.LAOS)
//       .format(DateFormat.DATETIME_READABLE_FORMAT);

//     response.vendor = entity.vendor
//       ? this._vendor.toResponse(entity.vendor)
//       : null;

//     response.vendor_bank_account = entity.vendor_bank_account
//       ? entity.vendor_bank_account.map((bankAccount) =>
//           this._vendorBankAccount.toResponse(bankAccount),
//         )
//       : null;

//     return response;
//   }
// }
