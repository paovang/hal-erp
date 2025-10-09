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
  ): Promise<ResponseResult<BudgetAccountEntity>> {
    const queryBuilder = await this.createBaseQuery(manager);
    query.sort_by = 'budget_accounts.id';
    // Entity

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
      ]);

    // queryBuilder.addSelect(
    //   (subQuery) =>
    //     subQuery
    //       .select('COALESCE(SUM(increase_budgets.allocated_amount), 0)')
    //       .from('increase_budgets', 'increase_budgets')
    //       .where('increase_budgets.budget_account_id = budget_accounts.id'),
    //   'allocated_amount_total',
    // );

    // queryBuilder.addSelect(
    //   (subQuery) =>
    //     subQuery
    //       .select('COALESCE(SUM(document_transactions.amount), 0)')
    //       .from('document_transactions', 'document_transactions')
    //       .where('document_transactions.budget_item_id = budget_items.id'),
    //   'used_amount',
    // );

    // // Add a subquery to get the total allocated amount per budget item
    // queryBuilder.addSelect(
    //   (subQuery) =>
    //     subQuery
    //       .select('COALESCE(SUM(increase_budget_detail.allocated_amount), 0)')
    //       .from('increase_budget_details', 'increase_budget_detail')
    //       .where('increase_budget_detail.budget_item_id = budget_items.id'),
    //   'increase_amount',
    // );

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
}
