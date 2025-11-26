import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyOrmEntity } from '@src/common/infrastructure/database/typeorm/company.orm';
import { ReceiptOrmEntity } from '@src/common/infrastructure/database/typeorm/receipt.orm';
import { IReportCompanuRepository } from '@src/modules/reports/domain/ports/output/company-order-repository.interface';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class ReportReadCompanyRepository implements IReportCompanuRepository {
  constructor(
    @InjectRepository(ReceiptOrmEntity)
    private readonly _receiptOrm: Repository<CompanyOrmEntity>,
    // private readonly _dataAccessMapper: ReportReceiptDataAccessMapper,
    // @Inject(PAGINATION_SERVICE)
    // private readonly _paginationService: IPaginationService,
  ) {}
  async reportCompany(manager: EntityManager): Promise<any> {
    const item = await manager
      .createQueryBuilder(CompanyOrmEntity, 'company')
      .leftJoin('company.company_users', 'company_users')
      .leftJoin('company_users.user', 'user')
      .addSelect('COUNT(company_users.id)', 'total_user')
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
