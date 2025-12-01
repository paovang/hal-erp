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
  async reportCompany(manager: EntityManager): Promise<any> {
    const items = await manager
      .createQueryBuilder(CompanyOrmEntity, 'company')
      .leftJoinAndSelect('company.company_users', 'company_users')
      .leftJoinAndSelect('company_users.user', 'user')
      .leftJoinAndSelect('company.budget_accounts', 'budget_accounts')
      .leftJoinAndSelect('budget_accounts.increase_budgets', 'increase_budgets')
      .leftJoinAndSelect('budget_accounts.budget_items', 'budget_items')
      .leftJoinAndSelect(
        'budget_items.increase_budget_detail',
        'increase_budget_detail',
      )
      .leftJoinAndSelect(
        'budget_items.document_transactions',
        'document_transactions',
      )
      .loadRelationCountAndMap(
        'company.approvalWorkflowCount',
        'company.approval_workflows',
      )
      .loadRelationCountAndMap(
        'company.budgetRuleCount',
        'company.budget_approval_rules',
      )
      .loadRelationCountAndMap('company.userCount', 'company.company_users')
      .getMany();

    const result = items.map((company) => {
      // รวม allocated_amount ของ increase_budgets
      const allocated_amount =
        company.budget_accounts
          ?.flatMap((ba) => ba.increase_budgets ?? [])
          .reduce((sum, b) => sum + Number(b.allocated_amount ?? 0), 0) ?? 0;

      // รวม increase_amount ของ increase_budget_detail ใน budget_items
      const increase_amount =
        company.budget_accounts
          ?.flatMap((ba) => ba.budget_items ?? [])
          .flatMap((bi) => bi.increase_budget_detail ?? [])
          .reduce((sum, d) => sum + Number(d.allocated_amount ?? 0), 0) ?? 0;

      // รวม totalUsedAmount ของ document_transactions
      const totalUsedAmount =
        company.budget_accounts
          ?.flatMap((ba) => ba.budget_items ?? [])
          .flatMap((bi) => bi.document_transactions ?? [])
          .reduce((sum, dt) => sum + Number(dt.amount ?? 0), 0) ?? 0;

      const total_budget = allocated_amount - increase_amount;
      const balance_amount = increase_amount - totalUsedAmount;

      return {
        ...company,
        logo: company?.logo
          ? `${process.env.AWS_CLOUDFRONT_DISTRIBUTION_DOMAIN_NAME}/${company.logo}`
          : null,
        company_users: company.company_users?.map((cu) => {
          const { password, ...user } = cu.user;
          return user;
        }),
        allocated_amount,
        increase_amount,
        totalUsedAmount,
        total_budget,
        balance_amount,
      };
    });

    return result;
  }
}
