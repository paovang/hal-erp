import { Inject, Injectable } from '@nestjs/common';
import { IReadBudgetAccountRepository } from '@src/modules/manage/domain/ports/output/budget-account-repository.interface';
import { BudgetAccountDataAccessMapper } from '../../mappers/budget-account.mapper';
import { PAGINATION_SERVICE } from '@src/common/constants/inject-key.const';
import {
  FilterOptions,
  IPaginationService,
  ResponseResult,
} from '@src/common/infrastructure/pagination/pagination.interface';
import { BudgetAccountQueryDto } from '@src/modules/manage/application/dto/query/budget-account.dto';
import { EntityManager } from 'typeorm';
import { BudgetAccountEntity } from '@src/modules/manage/domain/entities/budget-account.entity';
import { BudgetAccountOrmEntity } from '@src/common/infrastructure/database/typeorm/budget-account.orm';
import { BudgetAccountId } from '@src/modules/manage/domain/value-objects/budget-account-id.vo';
import { DepartmentId } from '@src/modules/manage/domain/value-objects/department-id.vo';
import {
  selectBudgetItemDetails,
  selectBudgetItems,
  selectDepartments,
} from '@src/common/constants/select-field';
import { EligiblePersons } from '@src/modules/manage/application/constants/status-key.const';
import { ReportBudgetInterface } from '@src/common/application/interfaces/report-budget.interface';
import { CompanyOrmEntity } from '@src/common/infrastructure/database/typeorm/company.orm';

@Injectable()
export class ReadBudgetAccountRepository
  implements IReadBudgetAccountRepository
{
  constructor(
    private readonly _dataAccessMapper: BudgetAccountDataAccessMapper,
    @Inject(PAGINATION_SERVICE)
    private readonly _paginationService: IPaginationService,
  ) {}

  async findAll(
    query: BudgetAccountQueryDto,
    manager: EntityManager,
    company_id?: number,
    roles?: string[],
    department_id?: number,
  ): Promise<ResponseResult<BudgetAccountEntity>> {
    const queryBuilder = await this.createBaseQuery(manager);
    query.sort_by = 'budget_accounts.id';
    // Entity

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
          queryBuilder.where('budget_accounts.company_id = :company_id', {
            company_id,
          });
        }
        if (department_id) {
          queryBuilder.andWhere(
            'budget_accounts.department_id = :department_id',
            { department_id },
          );
        }
      }
      if (department_id) {
        queryBuilder.andWhere(
          'budget_accounts.department_id = :department_id',
          { department_id },
        );
      }
    }

    const data = await this._paginationService.paginate(
      queryBuilder,
      query,
      this._dataAccessMapper.toEntity.bind(this._dataAccessMapper),
      this.getFilterOptions(),
    );
    return data;
  }

  private createBaseQuery(manager: EntityManager) {
    const queryBuilder = manager
      .createQueryBuilder(BudgetAccountOrmEntity, 'budget_accounts')
      .leftJoinAndSelect('budget_accounts.departments', 'departments')
      .leftJoin('budget_accounts.company', 'company')
      .leftJoin('budget_accounts.increase_budgets', 'increase_budgets')
      .leftJoin('budget_accounts.budget_items', 'budget_items')
      .leftJoin('budget_items.increase_budget_detail', 'increase_budget_detail')
      .leftJoin('budget_items.document_transactions', 'document_transactions')
      .addSelect([
        'increase_budgets.id',
        'increase_budgets.allocated_amount',
        'budget_items.id',
        'budget_items.name',
        'increase_budget_detail.id',
        'increase_budget_detail.allocated_amount',
        'document_transactions.id',
        'document_transactions.amount',
        'company.id',
        'company.name',
        'company.tel',
        'company.logo',
        'company.email',
        'company.address',
      ]);

    return queryBuilder;
  }

  private getFilterOptions(): FilterOptions {
    return {
      searchColumns: [
        'budget_accounts.name',
        'budget_accounts.code',
        'departments.name',
      ],
      dateColumn: '',
      filterByColumns: ['budget_accounts.fiscal_year'],
    };
  }

  async findOne(
    id: BudgetAccountId,
    manager: EntityManager,
  ): Promise<ResponseResult<BudgetAccountEntity>> {
    const item = await this.createBaseQuery(manager)
      .where('budget_accounts.id = :id', { id: id.value })
      .getOneOrFail();

    return this._dataAccessMapper.toEntity(item);
  }

  async report(
    id: DepartmentId,
    query: BudgetAccountQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<BudgetAccountEntity>> {
    const queryBuilder = await this.createReportQuery(manager, id);
    query.sort_by = 'budget_accounts.id';
    const data = await this._paginationService.paginate(
      queryBuilder,
      query,
      this._dataAccessMapper.toEntity.bind(this._dataAccessMapper),
      this.getReportFilterOptions(),
    );
    return data;
  }

  private createReportQuery(manager: EntityManager, id: DepartmentId) {
    const selectFields = [
      ...selectDepartments,
      ...selectBudgetItems,
      ...selectBudgetItemDetails,
      // Add SUM for ADD
      'SUM(CASE WHEN detail_transactions.transaction_type = \'add\' THEN detail_transactions.amount ELSE 0 END) AS "sumAdd"',
      // Add SUM for SPEND
      'SUM(CASE WHEN detail_transactions.transaction_type = \'spend\' THEN detail_transactions.amount ELSE 0 END) AS "sumSpend"',
    ];
    const queryBuilder = manager
      .createQueryBuilder(BudgetAccountOrmEntity, 'budget_accounts')
      .leftJoin('budget_accounts.departments', 'departments')
      .leftJoin('budget_accounts.budget_items', 'budget_items')
      .leftJoin('budget_items.budget_item_details', 'budget_item_details')
      .leftJoin('budget_item_details.provinces', 'provinces')
      .leftJoin(
        'budget_item_details.detail_transactions',
        'detail_transactions',
      )
      .where('departments.id = :id', { id: id.value })
      .addSelect(selectFields)
      .groupBy('budget_accounts.id')
      .addGroupBy('departments.id')
      .addGroupBy('departments.name')
      .addGroupBy('budget_items.id')
      .addGroupBy('budget_items.name')
      .addGroupBy('budget_item_details.id')
      .addGroupBy('budget_item_details.name');

    return queryBuilder;
  }

  private getReportFilterOptions(): FilterOptions {
    return {
      searchColumns: ['budget_accounts.name', 'budget_accounts.code'],
      dateColumn: '',
      filterByColumns: ['budget_accounts.type'],
    };
  }

  async getAllForHalGroupMonthlyBudget(
    query: BudgetAccountQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<ReportBudgetInterface>> {
    // ---------------- QUERY ----------------
    const reportQuery = manager
      .createQueryBuilder(CompanyOrmEntity, 'company')
      .leftJoin('company.budget_accounts', 'ba')

      // Total allocated amount for ALL budget accounts of the company 730000000
      .addSelect(
        `(
        SELECT COALESCE(SUM(ib.allocated_amount), 0)
        FROM increase_budgets ib
        WHERE ib.budget_account_id IN (
          SELECT id FROM budget_accounts WHERE company_id = company.id
        )
      ) AS total_budget`,
      )

      // Total used amount for ALL budget accounts of the company
      .addSelect(
        `(
        SELECT COALESCE(SUM(dt.amount),0)
        FROM document_transactions dt
        WHERE dt.budget_item_id IN (
          SELECT bi.id
          FROM budget_items bi
          WHERE bi.budget_account_id IN (
            SELECT id FROM budget_accounts WHERE company_id = company.id
          )
        )
      ) AS used_amount`,
      )

      .addSelect('company.id', 'id')
      .addSelect('company.name', 'name')
      .addSelect('company.logo', 'logo')

      // Only group by company
      .groupBy('company.id');

    // ---------------- FILTERS ----------------
    if (query.company_id) {
      reportQuery.andWhere('company.id = :company_id', {
        company_id: query.company_id,
      });
    }

    if (query.departmentId) {
      reportQuery.andWhere('ba.department_id = :department_id', {
        department_id: query.departmentId,
      });
    }

    if (query.fiscal_year) {
      reportQuery.andWhere('ba.fiscal_year = :fiscal_year', {
        fiscal_year: query.fiscal_year,
      });
    }

    // ---------------- EXECUTE QUERY ----------------
    const result = await reportQuery.getRawMany();

    // ---------------- PROCESS RESULTS ----------------
    const reportData: ReportBudgetInterface = {
      budget_overruns: {
        amount: 0,
        total: 0,
        budget: [],
      },
      within_budget: {
        amount: 0,
        total: 0,
        budget: [],
      },
    };

    // const parseNumber = (value: any): number =>
    //   typeof value === 'string' ? parseFloat(value) : value || 0;

    for (const row of result) {
      const totalBudget = Number(row.total_budget);
      const usedAmount = Number(row.used_amount);
      const remainingAmount = totalBudget - usedAmount;

      const logo_url = row?.logo
        ? `${process.env.AWS_CLOUDFRONT_DISTRIBUTION_DOMAIN_NAME}/${row.logo}`
        : '';

      const companyReport = {
        id: row.id,
        name: row.name,
        logo: logo_url,
        allocated_amount: totalBudget,
        total:
          remainingAmount < 0 ? Math.abs(remainingAmount) : remainingAmount,
      };

      if (remainingAmount < 0) {
        // Budget overrun
        reportData.budget_overruns.amount += 1;
        reportData.budget_overruns.total += Math.abs(remainingAmount);
        reportData.budget_overruns.budget.push(companyReport);
      } else {
        // Within budget
        reportData.within_budget.amount += 1;
        reportData.within_budget.total += remainingAmount;
        reportData.within_budget.budget.push(companyReport);
      }
    }

    // ---------------- RETURN ----------------
    return reportData;
  }
}
