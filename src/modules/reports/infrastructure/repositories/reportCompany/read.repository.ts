import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PAGINATION_SERVICE } from '@src/common/constants/inject-key.const';
import { CompanyOrmEntity } from '@src/common/infrastructure/database/typeorm/company.orm';
import { IPaginationService } from '@src/common/infrastructure/pagination/pagination.interface';
import { IReportCompanuRepository } from '@src/modules/reports/domain/ports/output/company-repository.interface';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class ReportReadCompanyRepository implements IReportCompanuRepository {
  constructor(
    @InjectRepository(CompanyOrmEntity)
    private readonly _companyOrm: Repository<CompanyOrmEntity>,
    // private readonly _dataAccessMapper: ReportReceiptDataAccessMapper,
    @Inject(PAGINATION_SERVICE)
    private readonly _paginationService: IPaginationService,
  ) {}
  async reportCompany(manager: EntityManager): Promise<any[]> {
    const rows = await manager
      .createQueryBuilder()
      .select('c.id', 'companyId')
      .addSelect('c.name', 'companyName')
      .addSelect('c.logo', 'logo')

      // users count
      .addSelect(
        `(SELECT COUNT(*) FROM company_users cu WHERE cu.company_id = c.id)`,
        'userCount',
      )

      // pending documents with receipts count
      .addSelect(
        `
      (
        SELECT COUNT(r.id)
        FROM documents d
        INNER JOIN receipts r ON r.document_id = d.id
        WHERE d.company_id = c.id
        AND d.status = 'pending'
      )
      `,
        'approvalWorkflowCount',
      )

      // budget rule count
      .addSelect(
        `(SELECT COUNT(*) FROM budget_approval_rules br WHERE br.company_id = c.id)`,
        'budgetRuleCount',
      )

      // allocated_amount (increase_budgets)
      .addSelect(
        `
      (
        SELECT COALESCE(SUM(ib.allocated_amount), 0)
        FROM increase_budgets ib
        INNER JOIN budget_accounts ba ON ba.id = ib.budget_account_id
        WHERE ba.company_id = c.id
      )
      `,
        'allocated_amount',
      )

      // increase_amount (increase_budget_detail)
      .addSelect(
        `
  (
    SELECT COALESCE(SUM(ibd.allocated_amount), 0)
    FROM increase_budget_details ibd
    INNER JOIN budget_items bi ON bi.id = ibd.budget_item_id
    INNER JOIN budget_accounts ba ON ba.id = bi.budget_account_id
    WHERE ba.company_id = c.id
  )
  `,
        'increase_amount',
      )

      // used amount
      .addSelect(
        `
      (
        SELECT COALESCE(SUM(dt.amount), 0)
        FROM document_transactions dt
        INNER JOIN budget_items bi ON bi.id = dt.budget_item_id
        INNER JOIN budget_accounts ba ON ba.id = bi.budget_account_id
        WHERE ba.company_id = c.id
      )
      `,
        'totalUsedAmount',
      )

      .from('companies', 'c')
      .getRawMany();

    return rows.map((r) => {
      const allocated = Number(r.allocated_amount);
      const increase = Number(r.increase_amount);
      const used = Number(r.totalUsedAmount);

      return {
        companyId: r.companyId,
        companyName: r.companyName,
        logo: r.logo
          ? `${process.env.AWS_CLOUDFRONT_DISTRIBUTION_DOMAIN_NAME}/${r.logo}`
          : null,

        userCount: Number(r.userCount),
        approvalWorkflowCount: Number(r.approvalWorkflowCount),
        budgetRuleCount: Number(r.budgetRuleCount),

        allocated_amount: allocated,
        increase_amount: increase,
        totalUsedAmount: used,

        total_budget: allocated - increase,
        balance_amount: increase - used,
      };
    });
  }
}
