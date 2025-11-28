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
import { BudgetItemOrmEntity } from '@src/common/infrastructure/database/typeorm/budget-item.orm';
import {
  CompanyInterface,
  ReportBudgetInterface,
} from '@src/common/application/interfaces/report-budget.interface';

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

  // Assuming your ORM entities and interfaces are imported

  async getAllForHalGroupMonthlyBudget(
    query: BudgetAccountQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<ReportBudgetInterface>> {
    // 1. Fetch budget accounts, total budget, and company details (Remains the same)
    const budgetAccounts = await manager
      .createQueryBuilder(BudgetAccountOrmEntity, 'budget_accounts')
      .leftJoin('budget_accounts.increase_budgets', 'increase_budgets')
      .leftJoin('budget_accounts.company', 'company')
      .select([
        'budget_accounts.id AS id',
        'budget_accounts.company_id AS company_id',
        'company.name AS company_name',
        'company.logo AS company_logo',
        'COALESCE(SUM(increase_budgets.allocated_amount), 0) AS total_budget', // Total allocated for THIS budget account
      ])
      .where('budget_accounts.company_id IS NOT NULL')
      .groupBy('budget_accounts.id')
      .addGroupBy('budget_accounts.company_id')
      .addGroupBy('company.name')
      .addGroupBy('company.logo');
    // ... (rest of WHERE clauses remain the same)
    if (query.company_id) {
      budgetAccounts.andWhere('budget_accounts.company_id = :company_id', {
        company_id: query.company_id,
      });
    }

    if (query.departmentId) {
      budgetAccounts.andWhere(
        'budget_accounts.department_id = :department_id',
        {
          department_id: query.departmentId,
        },
      );
    }

    if (query.fiscal_year) {
      budgetAccounts.andWhere('budget_accounts.fiscal_year = :fiscal_year', {
        fiscal_year: query.fiscal_year,
      });
    }

    const result = await budgetAccounts.getRawMany();

    // 2. Initialize the return structure and two aggregation maps
    const data: ReportBudgetInterface = {
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

    // Use AggregatedCompanyData to include 'allocated_amount'
    type AggregatedCompanyData = CompanyInterface & {
      allocated_amount: number;
    };

    // Temporary maps to aggregate total variance and company info by company_id
    const overrunMap: Map<string | null, AggregatedCompanyData> = new Map();
    const withinBudgetMap: Map<string | null, AggregatedCompanyData> =
      new Map();

    // 3. Loop through results and aggregate variance AND allocated budget by Company ID
    for (const item of result) {
      // Fetch used amount (Query 2 - remains the same)
      const usedResult = await manager
        .createQueryBuilder(BudgetItemOrmEntity, 'budget_items')
        .leftJoin('budget_items.document_transactions', 'document_transactions')
        .leftJoin('budget_items.budget_accounts', 'budget_accounts')
        .select([
          'COALESCE(SUM(document_transactions.amount), 0) AS used_amount',
        ])
        .where('budget_items.budget_account_id = :budget_account_id', {
          budget_account_id: item.id,
        })
        .andWhere('budget_accounts.company_id = :company_id', {
          company_id: item.company_id,
        })
        .getRawOne();

      const totalBudget = Number(item.total_budget); // Allocated amount for this budget account
      const usedAmount = Number(usedResult?.used_amount || 0);
      const companyId: string | null = item.company_id;

      let targetMap: Map<string | null, AggregatedCompanyData>;
      let variance: number;

      if (usedAmount > totalBudget) {
        // Case: Budget Overrun
        variance = usedAmount - totalBudget;
        targetMap = overrunMap;
        data.budget_overruns.total += variance;
      } else {
        // Case: Within Budget
        variance = totalBudget - usedAmount;
        targetMap = withinBudgetMap;
        data.within_budget.total += variance;
      }

      // *** AGGREGATION LOGIC (UPDATED) ***
      if (targetMap.has(companyId)) {
        // Company exists in the map, add the current variance AND allocated amount
        const existingData = targetMap.get(companyId)!;
        existingData.total += variance;
        existingData.allocated_amount += totalBudget; // Accumulate allocated budget
      } else {
        const logo_url = item?.company_logo
          ? `${process.env.AWS_CLOUDFRONT_DISTRIBUTION_DOMAIN_NAME}/${item.company_logo}`
          : null;
        // First time seeing this company, create new entry
        targetMap.set(companyId, {
          id: Number(companyId),
          name: item.company_name || '',
          logo: logo_url || '',
          total: variance,
          allocated_amount: totalBudget, // Initialize allocated budget
        });
      }
    }

    // 4. Finalize the return structure and filter out null company IDs

    // 4a. Convert maps to arrays and FILTER out entries where the company 'id' is null
    data.budget_overruns.budget = Array.from(overrunMap.values()).filter(
      (item) => item.id !== null,
    );

    data.within_budget.budget = Array.from(withinBudgetMap.values()).filter(
      (item) => item.id !== null,
    );

    // 4b. Recalculate summary totals and amounts based ONLY on the filtered/valid companies

    data.budget_overruns.total = data.budget_overruns.budget.reduce(
      (sum, item) => sum + item.total,
      0,
    );
    data.within_budget.total = data.within_budget.budget.reduce(
      (sum, item) => sum + item.total,
      0,
    );

    // The amount now counts the number of valid companies
    data.budget_overruns.amount = data.budget_overruns.budget.length;
    data.within_budget.amount = data.within_budget.budget.length;

    return data;
  }
}
