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
    // 1. Single Query: Get Allocated Budget and Used Amount per Budget Account
    const reportQuery = manager
      .createQueryBuilder(CompanyOrmEntity, 'company')
      .leftJoin('company.budget_accounts', 'budget_accounts')
      // ... (Rest of the query remains the same)

      // --- PATH 1: Allocated Amount (Increase Budgets) ---
      .leftJoin('budget_accounts.increase_budgets', 'increase_budgets')

      // --- PATH 2: Used Amount (Budget Items -> Document Transactions) ---
      .leftJoin('budget_accounts.budget_items', 'budget_items')
      .leftJoin('budget_items.document_transactions', 'document_transactions')

      .select([
        'company.id AS id', // Select Company ID for use in the final structure
        'company.name AS name', // Select Company Name
        'company.logo AS logo', // Select Company Logo

        // Sum 1: Total allocated for THIS budget account (must be aliased to total_budget)
        'COALESCE(SUM(increase_budgets.allocated_amount), 0) AS total_budget',

        // Sum 2: Total used amount for THIS budget account (must be aliased to used_amount)
        'COALESCE(SUM(document_transactions.amount), 0) AS used_amount',
      ])
      .addGroupBy('company.id')
      .addGroupBy('company.name')
      .addGroupBy('company.logo');

    // Add Filtering based on the query DTO
    if (query.company_id) {
      reportQuery.andWhere('company.id = :company_id', {
        company_id: query.company_id,
      });
    }

    if (query.departmentId) {
      reportQuery.andWhere('budget_accounts.department_id = :department_id', {
        department_id: query.departmentId,
      });
    }

    if (query.fiscal_year) {
      reportQuery.andWhere('budget_accounts.fiscal_year = :fiscal_year', {
        fiscal_year: query.fiscal_year,
      });
    }

    // Execute the query
    const result = await reportQuery.getRawMany();

    // 2. Process Raw Results into the Desired Structure
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
      console.log('totalBudget', totalBudget);
      console.log('usedAmount', usedAmount);
      console.log('remainingAmount', remainingAmount);
      const logo_url = row?.logo
        ? `${process.env.AWS_CLOUDFRONT_DISTRIBUTION_DOMAIN_NAME}/${row.logo}`
        : '';

      const companyReport = {
        id: row.id,
        name: row.name,
        logo: logo_url,
        allocated_amount: totalBudget,
        total: 0,
      };

      if (remainingAmount < 0) {
        // Budget Overrun: used_amount > total_budget
        const overspentAmount = Math.abs(remainingAmount);
        companyReport.total = overspentAmount;

        reportData.budget_overruns.amount += 1;
        reportData.budget_overruns.total += overspentAmount;
        reportData.budget_overruns.budget.push(companyReport);
      } else {
        // Within Budget: used_amount <= total_budget
        // We use the full allocated budget as the total amount for this category
        companyReport.total = totalBudget;

        reportData.within_budget.amount += 1;
        reportData.within_budget.total += remainingAmount;
        reportData.within_budget.budget.push(companyReport);
      }
    }

    // 3. Return the processed and structured data
    return reportData;
  }
}
