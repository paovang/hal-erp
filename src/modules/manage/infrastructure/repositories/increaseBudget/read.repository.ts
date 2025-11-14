import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IncreaseBudgetOrmEntity } from '@src/common/infrastructure/database/typeorm/increase-budget.orm';
import { IReadIncreaseBudgetRepository } from '@src/modules/manage/domain/ports/output/increase-budget-repository.interface';
import { EntityManager, Repository } from 'typeorm';
import { IncreaseBudgetDataAccessMapper } from '../../mappers/increase-budget.mapper';
import { PAGINATION_SERVICE } from '@src/common/constants/inject-key.const';
import {
  FilterOptions,
  IPaginationService,
  ResponseResult,
} from '@src/common/infrastructure/pagination/pagination.interface';
import { IncreaseBudgetQueryDto } from '@src/modules/manage/application/dto/query/increase-budget.dto';
import { IncreaseBudgetEntity } from '@src/modules/manage/domain/entities/increase-budget.entity';
import {
  selectBudgetAccounts,
  selectBudgetItems,
  selectCompany,
  selectDepartments,
  selectIncreaseBudgetDetails,
  selectIncreaseBudgetFiles,
  selectUsers,
} from '@src/common/constants/select-field';
import { IncreaseBudgetId } from '@src/modules/manage/domain/value-objects/increase-budget-id.vo';
import { EligiblePersons } from '@src/modules/manage/application/constants/status-key.const';

@Injectable()
export class ReadIncreaseBudgetRepository
  implements IReadIncreaseBudgetRepository
{
  constructor(
    @InjectRepository(IncreaseBudgetOrmEntity)
    private readonly _increaseBudgetOrm: Repository<IncreaseBudgetOrmEntity>,
    private readonly _dataAccessMapper: IncreaseBudgetDataAccessMapper,
    @Inject(PAGINATION_SERVICE)
    private readonly _paginationService: IPaginationService,
  ) {}

  async findAll(
    query: IncreaseBudgetQueryDto,
    manager: EntityManager,
    company_id?: number,
    roles?: string[],
    department_id?: number,
  ): Promise<ResponseResult<IncreaseBudgetEntity>> {
    const filterOptions = this.getFilterOptions();
    const budget_account = Number(query.budget_account_id);
    const queryBuilder = await this.createBaseQuery(manager);
    query.sort_by = 'increase_budgets.id';

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
      }

      if (department_id) {
        queryBuilder.andWhere(
          'budget_accounts.department_id = :department_id',
          {
            department_id,
          },
        );
      }
    }

    if (budget_account) {
      queryBuilder.andWhere('budget_accounts.id = :budget_account', {
        budget_account,
      });
    }

    // Date filtering (single date)
    this.applyDateFilter(queryBuilder, filterOptions.dateColumn, query.date);

    const data = await this._paginationService.paginate(
      queryBuilder,
      query,
      this._dataAccessMapper.toEntity.bind(this._dataAccessMapper),
      filterOptions,
    );
    return data;
  }

  private createBaseQuery(manager: EntityManager) {
    const selectField = [
      ...selectBudgetAccounts,
      ...selectDepartments,
      ...selectIncreaseBudgetFiles,
      ...selectUsers,
      ...selectIncreaseBudgetDetails,
      ...selectBudgetItems,
      ...selectCompany,
    ];

    const queryBuilder = manager
      .createQueryBuilder(IncreaseBudgetOrmEntity, 'increase_budgets')
      .leftJoin(
        'increase_budgets.increase_budget_files',
        'increase_budget_files',
      )
      .leftJoin('increase_budgets.users', 'users')
      .leftJoin('increase_budgets.budget_account', 'budget_accounts')
      .leftJoin('budget_accounts.company', 'company')
      .leftJoin('budget_accounts.departments', 'departments')
      .innerJoin('increase_budgets.increase_budget_details', 'details')
      .innerJoin('details.budget_item', 'budget_items')
      .addSelect(selectField);

    return queryBuilder;
  }

  private getFilterOptions(): FilterOptions {
    return {
      searchColumns: [],
      dateColumn: 'increase_budgets.import_date',
      filterByColumns: [],
    };
  }

  private applyDateFilter(
    queryBuilder: any,
    dateColumn: string | undefined,
    date?: string,
  ) {
    if (dateColumn && date) {
      queryBuilder.andWhere(`EXTRACT(YEAR FROM ${dateColumn}) = :year`, {
        year: Number(date),
      });
    }
  }

  async findOne(
    id: IncreaseBudgetId,
    manager: EntityManager,
  ): Promise<ResponseResult<IncreaseBudgetEntity>> {
    const item = await this.createBaseQuery(manager)
      .where('increase_budgets.id = :id', { id: id.value })
      .getOneOrFail();

    return this._dataAccessMapper.toEntity(item);
  }
}
