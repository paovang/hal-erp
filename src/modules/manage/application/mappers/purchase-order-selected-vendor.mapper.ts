import { Injectable } from '@nestjs/common';
import { PurchaseOrderSelectedVendorResponse } from '../dto/response/purchase-order-selected-vendor.response';
import moment from 'moment-timezone';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { PurchaseOrderSelectedVendorEntity } from '../../domain/entities/purchase-order-selected-vendor.entity';
import { VendorDataMapper } from './vendor.mapper';
import { VendorBankAccountDataMapper } from './vendor-bank-account.mapper';
import { CreatePurchaseOrderSelectedVendorDto } from '../dto/create/purchaseOrderSelectedVendor/create.dto';

@Injectable()
export class PurchaseOrderSelectedVendorDataMapper {
  constructor(
    private readonly _vendor: VendorDataMapper,
    private readonly _vendorBankAccount: VendorBankAccountDataMapper,
  ) {}

  toEntity(
    dto: CreatePurchaseOrderSelectedVendorDto,
    po_id?: number,
  ): PurchaseOrderSelectedVendorEntity {
    const builder = PurchaseOrderSelectedVendorEntity.builder();

    if (po_id) {
      builder.setPurchaseOrderId(po_id);
    }

    if (dto.vendor_id) {
      builder.setVendorId(dto.vendor_id);
    }

    if (dto.filename) {
      builder.setFilename(dto.filename);
    }

    if (dto.reason) {
      builder.setReason(dto.reason);
    }

    return builder.build();
  }

  /** Mapper Entity To Response */
  toResponse(
    entity: PurchaseOrderSelectedVendorEntity,
  ): PurchaseOrderSelectedVendorResponse {
    const response = new PurchaseOrderSelectedVendorResponse();
    response.id = entity.getId().value;
    response.purchase_order_id = Number(entity.purchase_order_id);
    response.vendor_id = Number(entity.vendor_id);
    response.filename = entity.filename;
    response.reason = entity.reason;
    response.created_at = moment
      .tz(entity.createdAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);
    response.updated_at = moment
      .tz(entity.updatedAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);

    response.vendor = this._vendor.toResponse(entity.vendor!);

    response.vendor_bank_account = entity.vendor_bank_account
      ? entity.vendor_bank_account.map((account) =>
          this._vendorBankAccount.toResponse(account),
        )
      : [];

    return response;
  }
}
