import { Injectable } from '@nestjs/common';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import moment from 'moment-timezone';
import { ReceiptEntity } from '../../domain/entities/receipt.entity';
import { ReceiptResponse } from '../dto/response/receipt.response';
import { ReceiptItemDataMapper } from './receipt-item.mapper';
import { DocumentDataMapper } from './document.mapper';
import { UserApprovalDataMapper } from './user-approval.mapper';
import { ReceiptInterface } from '../commands/receipt/interface/receipt.interface';
import { DocumentAttachmentDataMapper } from './document-attachment.mapper';

// interface ReceiptInterface {
//   receipt_number?: string;
//   purchase_order_id?: number;
//   document_id?: number;
//   received_by?: number;
//   remark?: string;
// }
export class UpdateReceiptDto implements ReceiptInterface {
  receipt_number?: string;
  purchase_order_id?: number;
  document_id?: number;
  received_by?: number;
  remark?: string;
  slip?: string;
}

@Injectable()
export class ReceiptDataMapper {
  constructor(
    private readonly _receiptItemMapper: ReceiptItemDataMapper,
    private readonly documentMapper: DocumentDataMapper,
    private readonly userApprovalMapper: UserApprovalDataMapper,
    private readonly documentAttachmentMapper: DocumentAttachmentDataMapper,
  ) {}
  /** Mapper Dto To Entity */
  toEntity(dto: ReceiptInterface): ReceiptEntity {
    const builder = ReceiptEntity.builder();

    if (dto.purchase_order_id) {
      builder.setPurchaseOrderId(dto.purchase_order_id);
    }

    if (dto.document_id) {
      builder.setDocumentId(dto.document_id);
    }

    if (dto.receipt_number) {
      builder.setReceiptNumber(dto.receipt_number);
    }

    if (dto.received_by) {
      builder.setReceivedBy(dto.received_by);
    }

    if (dto.remark) {
      builder.setRemark(dto.remark);
    }

    // if (dto.slip) {
    //   builder.setSlip(dto.slip);
    // }

    return builder.build();
  }

  /** Mapper Entity To Response */
  toResponse(entity: ReceiptEntity): ReceiptResponse {
    const response = new ReceiptResponse();
    response.id = Number(entity.getId().value);
    response.receipt_number = entity.receipt_number;
    response.purchase_order_id = Number(entity.purchase_order_id);
    response.document_id = Number(entity.document_id);
    response.receipt_date = moment
      .tz(entity.receipt_date, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);
    response.received_by = Number(entity.received_by);
    response.remark = entity.remark;
    response.created_at = moment
      .tz(entity.createdAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);
    response.updated_at = moment
      .tz(entity.updatedAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);

    response.currency_totals = entity.currencyTotals?.length
      ? entity.currencyTotals.map((total) => ({
          id: +total.id,
          code: total.code || '',
          name: total.name || null,
          amount: +total.amount || 0,
        }))
      : [];

    response.document = entity.document
      ? this.documentMapper.toResponse(entity.document)
      : null;

    response.user_approval = entity.user_approval
      ? this.userApprovalMapper.toResponse(entity.user_approval)
      : null;

    response.document_attachment = entity.document_attachments
      ? entity.document_attachments.map((attachment) =>
          this.documentAttachmentMapper.toResponse(attachment),
        )
      : null;

    response.receipt_item =
      entity.item?.map((item) => this._receiptItemMapper.toResponse(item)) ??
      null;

    return response;
  }
}
