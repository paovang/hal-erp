import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReceiptOrmEntity } from '@src/common/infrastructure/database/typeorm/receipt.orm';
import { IReportReceiptRepository } from '@src/modules/reports/domain/ports/output/receipt-repository.interface';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class ReportReadReceiptRepository implements IReportReceiptRepository {
  constructor(
    @InjectRepository(ReceiptOrmEntity)
    private readonly _receiptOrm: Repository<ReceiptOrmEntity>,
    // private readonly _dataAccessMapper: ReportReceiptDataAccessMapper,
    // @Inject(PAGINATION_SERVICE)
    // private readonly _paginationService: IPaginationService,
  ) {}
  async reportMoney(manager: EntityManager): Promise<any> {
    const item = await manager
      .createQueryBuilder(ReceiptOrmEntity, 'receipts')
      .innerJoin('receipts.receipt_items', 'receipt_items')
      .leftJoin('receipt_items.payment_currency', 'currency')
      .select('document_statuses.name', 'status')
      .addSelect('receipt_items.payment_currency_id', 'currency_id')
      .addSelect('currency.code', 'currency_code')
      .addSelect('currency.name', 'currency_name')
      .addSelect('SUM(receipt_items.payment_total)', 'payment_total')
      .addSelect('SUM(receipt_items.vat)', 'total_vat')
      .innerJoin('receipts.documents', 'documents')
      .innerJoin('documents.user_approvals', 'user_approvals')
      .innerJoin('user_approvals.document_statuses', 'document_statuses')
      .groupBy('document_statuses.name')
      .addGroupBy('receipt_items.payment_currency_id')
      .addGroupBy('currency.code')
      .addGroupBy('currency.name')
      .getRawMany();

    const data = item.map((row) => ({
      status: row.status,
      currency_code: row.currency_code,
      currency_name: row.currency_name,
      payment_total: Number(row.payment_total),
      total_vat: Number(row.total_vat),
      total: Number(row.payment_total) + Number(row.total_vat),
    }));

    return data;
  }
}
