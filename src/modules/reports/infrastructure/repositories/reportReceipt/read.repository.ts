import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReceiptOrmEntity } from '@src/common/infrastructure/database/typeorm/receipt.orm';
import { EligiblePersons } from '@src/modules/manage/application/constants/status-key.const';
import { IReportReceiptRepository } from '@src/modules/reports/domain/ports/output/receipt-repository.interface';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class ReportReadReceiptRepository implements IReportReceiptRepository {
  constructor(
    @InjectRepository(ReceiptOrmEntity)
    private readonly _receiptOrm: Repository<ReceiptOrmEntity>,
  ) {}
  async reportMoney(
    manager: EntityManager,
    company_id?: number,
    roles?: string,
    department_id?: number,
  ): Promise<any> {
    const query = await manager
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
      .innerJoin('documents.departments', 'departments')
      .innerJoin('documents.user_approvals', 'user_approvals')
      .innerJoin('user_approvals.document_statuses', 'document_statuses')
      .groupBy('document_statuses.name')
      .addGroupBy('receipt_items.payment_currency_id')
      .addGroupBy('currency.code')
      .addGroupBy('currency.name');

    if (
      roles &&
      !roles.includes(EligiblePersons.SUPER_ADMIN) &&
      !roles.includes(EligiblePersons.ADMIN)
    ) {
      if (
        roles.includes(EligiblePersons.COMPANY_ADMIN) ||
        roles.includes(EligiblePersons.COMPANY_USER)
      ) {
        if (company_id) {
          query.andWhere('documents.company_id = :company_id', {
            company_id,
          });
        }
      }
      if (department_id) {
        query.andWhere('departments.id = :department_id', {
          department_id,
        });
      }
    }

    const item = await query.getRawMany();

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
