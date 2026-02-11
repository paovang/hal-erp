import { Injectable } from '@nestjs/common';
import { PurchaseOrderEntity } from '../../domain/entities/purchase-order.entity';
import { PurchaseOrderResponse } from '../dto/response/purchase-order.response';
import moment from 'moment-timezone';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { PurchaseOrderItemDataMapper } from './purchase-order-item.mapper';
// import { PurchaseOrderSelectedVendorDataMapper } from './purchase-order-selected-vendor.mapper';
import { PurchaseRequestDataMapper } from './purchase-request.mapper';
import { DocumentDataMapper } from './document.mapper';
import { UserApprovalDataMapper } from './user-approval.mapper';
import { CreatePurchaseOrderDto } from '../dto/create/purchaseOrder/create.dto';
import { PurchaseRequestOrmEntity } from '@src/common/infrastructure/database/typeorm/purchase-request.orm';
import { UpdatePurchaseOrderDto } from '../dto/create/purchaseOrder/update.dto';

@Injectable()
export class PurchaseOrderDataMapper {
  constructor(
    private readonly purchaseOrderItemMapper: PurchaseOrderItemDataMapper,
    // private readonly selectedVendorMapper: PurchaseOrderSelectedVendorDataMapper,
    private readonly purchaseRequestMapper: PurchaseRequestDataMapper,
    private readonly documentMapper: DocumentDataMapper,
    private readonly userApprovalMapper: UserApprovalDataMapper,
  ) {}

  toEntity(
    dto: CreatePurchaseOrderDto | UpdatePurchaseOrderDto,
    document_id?: number,
    pr?: PurchaseRequestOrmEntity,
    po_number?: string,
  ): PurchaseOrderEntity {
    const builder = PurchaseOrderEntity.builder();

    if ('purchase_request_id' in dto) {
      builder.setPurchaseRequestId(dto.purchase_request_id);
    }

    if (document_id) {
      builder.setDocumentId(document_id);
    }

    if (po_number) {
      builder.setPoNumber(po_number);
    }

    if (pr?.expired_date) {
      builder.setExpiredDate(pr.expired_date);
    }

    if (pr?.purposes) {
      builder.setPurposes(pr.purposes);
    }

    return builder.build();
  }

  /** Mapper Entity To Response */
  toResponse(entity: PurchaseOrderEntity): PurchaseOrderResponse {
    const isStepPending = entity.step > 0 ? true : false;

    const response = new PurchaseOrderResponse();
    response.id = entity.getId().value;
    response.purchase_request_id = Number(entity.purchase_request_id);
    response.po_number = entity.po_number;
    response.order_date = moment
      .tz(entity.order_date, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);
    response.expired_date = moment
      .tz(entity.expired_date, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);
    response.purposes = entity.purposes;
    response.is_created_rc = entity.isCreatedRc;
    response.created_at = moment
      .tz(entity.createdAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);
    response.updated_at = moment
      .tz(entity.updatedAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);
    response.sub_total = Number(entity.sub_total);
    response.vat = Number(entity.vat);
    response.total = Number(entity.total);
    response.step = isStepPending;

    response.purchase_request = entity.purchaseRequest
      ? this.purchaseRequestMapper.toResponse(entity.purchaseRequest)
      : null;

    response.document = entity.document
      ? this.documentMapper.toResponse(entity.document)
      : null;

    response.user_approval = entity.user_approval
      ? this.userApprovalMapper.toResponse(entity.user_approval)
      : null;

    response.purchase_order_item =
      entity.orderItem?.map((item) => {
        return this.purchaseOrderItemMapper.toResponse(item);
      }) ?? null;

    // response.selected_vendor = entity.selectedVendor
    //   ? entity.selectedVendor.map((vendor) =>
    //       this.selectedVendorMapper.toResponse(vendor),
    //     )
    //   : null;

    return response;
  }
}
