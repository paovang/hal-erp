import { Injectable } from '@nestjs/common';
import moment from 'moment-timezone';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { PurchaseRequestDataMapper } from '@src/modules/manage/application/mappers/purchase-request.mapper';
import { DocumentDataMapper } from '@src/modules/manage/application/mappers/document.mapper';
import { UserApprovalDataMapper } from '@src/modules/manage/application/mappers/user-approval.mapper';
import { ReportPurchaseOrderEntity } from '../../domain/entities/report-purchase-order.entity';
import { ReportPurchaseOrderResponse } from '../dto/response/report-purchase-order.response';
import { PurchaseOrderItemDataMapper } from '@src/modules/manage/application/mappers/purchase-order-item.mapper';

@Injectable()
export class ReportPurchaseOrderDataMapper {
  constructor(
    private readonly purchaseOrderItemMapper: PurchaseOrderItemDataMapper,
    // private readonly selectedVendorMapper: PurchaseOrderSelectedVendorDataMapper,
    private readonly purchaseRequestMapper: PurchaseRequestDataMapper,
    private readonly documentMapper: DocumentDataMapper,
    private readonly userApprovalMapper: UserApprovalDataMapper,
  ) {}

  /** Mapper Entity To Response */
  toResponse(entity: ReportPurchaseOrderEntity): ReportPurchaseOrderResponse {
    const isStepPending = entity.step > 0 ? true : false;

    const response = new ReportPurchaseOrderResponse();
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
    return response;
  }
}
