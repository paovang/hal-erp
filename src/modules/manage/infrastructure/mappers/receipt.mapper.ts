import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';
import { ReceiptEntity } from '../../domain/entities/receipt.entity';
import { ReceiptOrmEntity } from '@src/common/infrastructure/database/typeorm/receipt.orm';
import moment from 'moment-timezone';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { ReceiptId } from '../../domain/value-objects/receitp-id.vo';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ReceiptItemDataAccessMapper } from './receipt-item.mapper';
import { DocumentDataAccessMapper } from './document.mapper';
import { UserApprovalDataAccessMapper } from './user-approval.mapper';
import { CurrencyTotal } from '../../application/commands/receipt/interface/receipt.interface';
import { DocumentAttachmentDataAccessMapper } from './document-attachment.mapper';
import { InjectRepository } from '@nestjs/typeorm';
import { ExchangeRateOrmEntity } from '@src/common/infrastructure/database/typeorm/exchange-rate.orm';
import { Repository } from 'typeorm';

@Injectable()
export class ReceiptDataAccessMapper {
  constructor(
    private readonly receiptItemMapper: ReceiptItemDataAccessMapper,
    private readonly documentMapper: DocumentDataAccessMapper,
    private readonly userApprovalMapper: UserApprovalDataAccessMapper,
    private readonly documentAttachmentMapper: DocumentAttachmentDataAccessMapper,
    @InjectRepository(ExchangeRateOrmEntity)
    private readonly exchangeRateRepository: Repository<ExchangeRateOrmEntity>,
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

  async toEntity(
    ormData: ReceiptOrmEntity,
    step: number = 0,
  ): Promise<ReceiptEntity> {
    const items = ormData.receipt_items || [];
    const rateOrm = await this.exchangeRateRepository.find({
      where: { to_currency: { code: 'LAK' } },
      relations: ['from_currency', 'to_currency'],
    });

    const rateMap = new Map<string, number>(
      rateOrm.map((r) => [String(r.from_currency.id), Number(r.rate)]),
    );

    let sub_total = 0;
    let vat = 0;
    const currencyTotalMap = new Map<number, CurrencyTotal>();

    for (const item of items) {
      const { paymentTotalLak, vatLak } = this.convertItemToLak(item, rateMap);
      sub_total += paymentTotalLak;
      vat += vatLak;

      const paymentCurrency = item.payment_currency;
      const currencyId = paymentCurrency?.id;
      if (currencyId == null) continue;

      const existing = currencyTotalMap.get(currencyId);
      if (existing) {
        existing.total = (existing.total ?? 0) + paymentTotalLak;
        existing.vat = (existing.vat ?? 0) + vatLak;
        existing.amount += paymentTotalLak + vatLak;
      } else {
        currencyTotalMap.set(currencyId, {
          id: currencyId,
          code: paymentCurrency.code || '',
          name: paymentCurrency.name,
          total: paymentTotalLak,
          vat: vatLak,
          amount: paymentTotalLak + vatLak,
        });
      }
    }

    const count = items.length ?? 0;

    const total = sub_total + vat;

    const builder = ReceiptEntity.builder()
      .setReceiptId(new ReceiptId(ormData.id))
      .setReceiptNumber(ormData.receipt_number)
      .setReceiptNumber(ormData.receipt_number)
      .setDocumentId(ormData.document_id ?? 0)
      .setPurchaseOrderId(ormData.purchase_order_id ?? 0)
      .setPoNumber(ormData.purchase_orders?.po_number ?? '')
      .setPoDocType(
        ormData.purchase_orders?.documents?.document_types?.name ?? '',
      )
      .setPurchaseRequestId(ormData.purchase_orders?.purchase_request_id ?? 0)
      .setPrNumber(ormData.purchase_orders?.purchase_requests?.pr_number ?? '')
      .setPrDocType(
        ormData.purchase_orders?.purchase_requests?.documents?.document_types
          ?.name ?? '',
      )
      .setReceiptDate(ormData.receipt_date)
      .setReceivedBy(ormData.received_by ?? 0)
      .setRemark(ormData.remark)
      .setAccountCode(ormData.account_code ?? null)
      .setCreatedAt(ormData.created_at)
      .setUpdatedAt(ormData.updated_at)
      .setSubTotal(sub_total ?? 0)
      .setVat(vat ?? 0)
      .setTotal(total ?? 0)
      .setCountItem(count)
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
      builder.setCurrencyTotals(Array.from(currencyTotalMap.values()));
    }

    return builder.build();
  }

  private convertItemToLak(
    item: { payment_total?: number; vat?: number; payment_currency?: { id: number; code?: string } },
    rateMap: Map<string, number>,
  ): { paymentTotalLak: number; vatLak: number } {
    const paymentCurrency = item.payment_currency;
    const paymentTotal = Number(item.payment_total || 0);
    const itemVat = Number(item.vat || 0);

    if (!paymentCurrency) {
      throw new BadRequestException(
        'Receipt item is missing payment_currency; cannot convert to LAK.',
      );
    }

    if (paymentCurrency.code === 'LAK') {
      return { paymentTotalLak: paymentTotal, vatLak: itemVat };
    }

    const rate = rateMap.get(String(paymentCurrency.id));
    if (!rate) {
      const label = paymentCurrency.code ?? `id=${paymentCurrency.id}`;
      throw new BadRequestException(
        `Exchange rate from ${label} to LAK is not configured.`,
      );
    }

    return {
      paymentTotalLak: paymentTotal * rate,
      vatLak: itemVat * rate,
    };
  }
}
