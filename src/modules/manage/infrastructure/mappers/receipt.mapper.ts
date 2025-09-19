import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';
import { ReceiptEntity } from '../../domain/entities/receipt.entity';
import { ReceiptOrmEntity } from '@src/common/infrastructure/database/typeorm/receipt.orm';
import moment from 'moment-timezone';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { ReceiptId } from '../../domain/value-objects/receitp-id.vo';
import { Injectable } from '@nestjs/common';
import { ReceiptItemDataAccessMapper } from './receipt-item.mapper';
import { DocumentDataAccessMapper } from './document.mapper';
import { UserApprovalDataAccessMapper } from './user-approval.mapper';
import { CurrencyTotal } from '../../application/commands/receipt/interface/receipt.interface';
import { DocumentAttachmentDataAccessMapper } from './document-attachment.mapper';

@Injectable()
export class ReceiptDataAccessMapper {
  constructor(
    private readonly receiptItemMapper: ReceiptItemDataAccessMapper,
    private readonly documentMapper: DocumentDataAccessMapper,
    private readonly userApprovalMapper: UserApprovalDataAccessMapper,
    private readonly documentAttachmentMapper: DocumentAttachmentDataAccessMapper,
  ) {}
  toOrmEntity(
    receiptEntity: ReceiptEntity,
    method: OrmEntityMethod,
  ): ReceiptOrmEntity {
    const now = moment.tz(Timezone.LAOS).format(DateFormat.DATETIME_FORMAT);
    const id = receiptEntity.getId();

    const mediaOrmEntity = new ReceiptOrmEntity();
    if (id) {
      mediaOrmEntity.id = id.value;
    }
    mediaOrmEntity.receipt_number = receiptEntity.receipt_number;
    mediaOrmEntity.document_id = receiptEntity.document_id;
    mediaOrmEntity.purchase_order_id = receiptEntity.purchase_order_id;
    mediaOrmEntity.receipt_date = receiptEntity.receipt_date ?? new Date(now);
    mediaOrmEntity.remark = receiptEntity.remark;
    if (method === OrmEntityMethod.UPDATE) {
      mediaOrmEntity.account_code = receiptEntity.account_code ?? '';
    }
    if (method === OrmEntityMethod.CREATE) {
      mediaOrmEntity.received_by = receiptEntity.received_by;
      mediaOrmEntity.created_at = receiptEntity.createdAt ?? new Date(now);
    }
    mediaOrmEntity.updated_at = new Date(now);

    return mediaOrmEntity;
  }

  toEntity(ormData: ReceiptOrmEntity, step: number = 0): ReceiptEntity {
    const builder = ReceiptEntity.builder()
      .setReceiptId(new ReceiptId(ormData.id))
      .setReceiptNumber(ormData.receipt_number)
      .setReceiptNumber(ormData.receipt_number)
      .setDocumentId(ormData.document_id ?? 0)
      .setPurchaseOrderId(ormData.purchase_order_id ?? 0)
      .setReceiptDate(ormData.receipt_date)
      .setReceivedBy(ormData.received_by ?? 0)
      .setRemark(ormData.remark)
      .setAccountCode(ormData.account_code ?? null)
      .setCreatedAt(ormData.created_at)
      .setUpdatedAt(ormData.updated_at)
      .setStep(step);

    if (ormData.documents) {
      builder.setDocument(this.documentMapper.toEntity(ormData.documents));
      if (ormData.documents.user_approvals) {
        builder.setUserApproval(
          this.userApprovalMapper.toEntity(ormData.documents.user_approvals),
        );
      }
      if (ormData.documents.document_attachments) {
        builder.setDocumentAttachments(
          ormData.documents.document_attachments.map((attachment) =>
            this.documentAttachmentMapper.toEntity(attachment),
          ),
        );
      }
    }

    if (ormData.receipt_items) {
      builder.setItems(
        ormData.receipt_items.map((item) =>
          this.receiptItemMapper.toEntity(item),
        ),
      );
      // Calculate currency totals for this specific receipt
      const currencyTotals = this.calculateCurrencyTotalsFromItems(
        ormData.receipt_items,
      );
      builder.setCurrencyTotals(currencyTotals);
    }

    return builder.build();
  }

  private calculateCurrencyTotalsFromItems(
    receiptItems: any[],
  ): CurrencyTotal[] {
    const currencyMap = new Map<number, CurrencyTotal>();

    receiptItems.forEach((item) => {
      // Handle different possible data structures
      const paymentCurrency = item.payment_currency || item.currencies;
      const currencyId = paymentCurrency?.id;
      const currencyCode = paymentCurrency?.code;
      const currencyName = paymentCurrency?.name;
      const paymentTotal = parseFloat(item.payment_total) || 0;

      if (currencyId && paymentTotal > 0) {
        if (currencyMap.has(currencyId)) {
          const existing = currencyMap.get(currencyId)!;
          existing.amount += paymentTotal;
        } else {
          currencyMap.set(currencyId, {
            id: currencyId,
            code: currencyCode || '',
            name: currencyName,
            amount: paymentTotal,
          });
        }
      }
    });

    return Array.from(currencyMap.values());
  }
}
