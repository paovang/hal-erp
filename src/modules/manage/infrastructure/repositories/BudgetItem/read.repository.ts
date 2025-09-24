import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PAGINATION_SERVICE } from '@src/common/constants/inject-key.const';
import {
  FilterOptions,
  IPaginationService,
  ResponseResult,
} from '@src/common/infrastructure/pagination/pagination.interface';
import { IReadBudgetItemRepository } from '@src/modules/manage/domain/ports/output/budget-item-repository.interace';
import { BudgetItemDataAccessMapper } from '../../mappers/budget-item.mapper';
import { EntityManager } from 'typeorm';
import { BudgetItemQueryDto } from '@src/modules/manage/application/dto/query/budget-item.dto';
import { BudgetItemEntity } from '@src/modules/manage/domain/entities/budget-item.entity';
import { BudgetItemOrmEntity } from '@src/common/infrastructure/database/typeorm/budget-item.orm';
import { BudgetItemId } from '@src/modules/manage/domain/value-objects/budget-item-id.vo';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';

@Injectable()
export class ReadBudgetItemRepository implements IReadBudgetItemRepository {
  constructor(
    private readonly _dataAccessMapper: BudgetItemDataAccessMapper,
    @Inject(PAGINATION_SERVICE)
    private readonly _paginationService: IPaginationService,
  ) {}

  async findAll(
    query: BudgetItemQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<BudgetItemEntity>> {
    const budget_account_id = Number(query.budget_account_id);
    const queryBuilder = await this.createBaseQuery(manager, budget_account_id);
    query.sort_by = 'budget_items.id';

    const data = await this._paginationService.paginate(
      queryBuilder,
      query,
      this._dataAccessMapper.toEntity.bind(this._dataAccessMapper),
      this.getFilterOptions(),
    );
    return data;
  }

  private createBaseQuery(manager: EntityManager, budget_account_id?: number) {
    const query = manager
      .createQueryBuilder(BudgetItemOrmEntity, 'budget_items')
      .select([
        'budget_items.id',
        'budget_items.name',
        'budget_items.budget_account_id',
        'budget_items.created_at',
        'budget_items.updated_at',
      ])
      .innerJoin('budget_items.budget_accounts', 'budget_accounts')
      .leftJoin('budget_accounts.departments', 'departments')
      .addSelect([
        'budget_accounts.id',
        'budget_accounts.name',
        'budget_accounts.code',
        'budget_accounts.fiscal_year',
        'budget_accounts.department_id',
        'budget_accounts.created_at',
        'budget_accounts.updated_at',
        'departments.id',
        'departments.name',
        'departments.code',
        'departments.department_head_id',
        'departments.created_at',
        'departments.updated_at',
      ]);

    if (budget_account_id) {
      query.where('budget_accounts.id = :budget_account_id', {
        budget_account_id: budget_account_id,
      });
    }
    return query;
  }

  private getFilterOptions(): FilterOptions {
    return {
      searchColumns: ['budget_items.name'],
      dateColumn: '',
      filterByColumns: [],
    };
  }

  async findOne(
    id: BudgetItemId,
    manager: EntityManager,
  ): Promise<ResponseResult<BudgetItemEntity>> {
    const item = await this.createBaseQuery(manager)
      .where('budget_items.id = :id', { id: id.value })
      .getOneOrFail();

    return this._dataAccessMapper.toEntity(item);
  }

  async report(
    query: BudgetItemQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<BudgetItemEntity>> {
    const queryBuilder = await this.createBaseReportQuery(manager, query);
    query.sort_by = 'budget_items.id';

    const data = await this._paginationService.paginate(
      queryBuilder,
      query,
      this._dataAccessMapper.toEntity.bind(this._dataAccessMapper),
      this.getReportFilterOptions(),
    );
    return data;
  }

  private createBaseReportQuery(
    manager: EntityManager,
    query?: BudgetItemQueryDto,
  ) {
    const queryBuilder = manager
      .createQueryBuilder(BudgetItemOrmEntity, 'budget_items')
      .select([
        'budget_items.id',
        'budget_items.name',
        'budget_items.budget_account_id',
        'budget_items.created_at',
        'budget_items.updated_at',
      ])
      .innerJoin('budget_items.budget_accounts', 'budget_accounts')
      .leftJoin('budget_accounts.departments', 'departments')
      .leftJoin('budget_items.increase_budget_detail', 'increase_budget_detail')
      // .leftJoinAndSelect(
      //   'budget_items.increase_budget_detail',
      //   'increase_budget_detail',
      // )
      .addSelect([
        'budget_accounts.id',
        'budget_accounts.name',
        'budget_accounts.code',
        'budget_accounts.fiscal_year',
        'budget_accounts.type',
        'budget_accounts.department_id',
        'budget_accounts.created_at',
        'budget_accounts.updated_at',
        'departments.id',
        'departments.name',
        'departments.code',
        'departments.department_head_id',
        'departments.created_at',
        'departments.updated_at',
        'increase_budget_detail.allocated_amount',
      ])
      .groupBy('budget_items.id')
      .addGroupBy('increase_budget_detail.id')
      .addGroupBy('budget_accounts.id')
      .addGroupBy('departments.id');

    if (query?.budget_account_id) {
      queryBuilder.where('budget_accounts.id = :budget_account_id', {
        budget_account_id: query.budget_account_id,
      });
    }

    if (query?.type) {
      queryBuilder.where('budget_accounts.type = :type', {
        type: query.type,
      });
    }

    if (query?.department_id) {
      queryBuilder.where('departments.id = :department_id', {
        department_id: query.department_id,
      });
    }
    return queryBuilder;
  }
  private getReportFilterOptions(): FilterOptions {
    return {
      searchColumns: ['budget_items.name'],
      dateColumn: '',
      filterByColumns: [
        // 'budget_accounts.id',
        // 'budget_accounts.type',
        // 'departments.id',
      ],
    };
  }

  async getItemId(
    id: BudgetItemId,
    manager: EntityManager,
  ): Promise<BudgetItemEntity> {
    const item = await manager
      .createQueryBuilder(BudgetItemOrmEntity, 'budget_items')
      .select([
        'budget_items.id',
        'budget_items.name',
        'budget_items.budget_account_id',
        'budget_items.created_at',
        'budget_items.updated_at',
      ])
      .innerJoin('budget_items.budget_accounts', 'budget_accounts')
      .leftJoin('budget_accounts.departments', 'departments')
      .leftJoin('budget_items.increase_budget_detail', 'increase_budget_detail')
      .leftJoin('budget_items.document_transactions', 'document_transactions')
      .addSelect([
        'budget_accounts.id',
        'budget_accounts.name',
        'budget_accounts.code',
        'budget_accounts.fiscal_year',
        'budget_accounts.type',
        'budget_accounts.department_id',
        'budget_accounts.created_at',
        'budget_accounts.updated_at',
        'departments.id',
        'departments.name',
        'departments.code',
        'departments.department_head_id',
        'departments.created_at',
        'departments.updated_at',
        'increase_budget_detail.allocated_amount',
        'document_transactions.amount',
      ])
      .where('budget_items.id = :id', { id: id.value })
      .getOne();

    if (!item) {
      throw new ManageDomainException('errors.not_found', HttpStatus.NOT_FOUND);
    }

    return this._dataAccessMapper.toEntity(item);
  }

  async calculate(id: number, manager: EntityManager): Promise<number> {
    // Sum amount from document_transactions
    const documentTransactionSum = await manager
      .createQueryBuilder()
      .select('SUM(document_transactions.amount)', 'total')
      .from('document_transactions', 'document_transactions')
      .where('document_transactions.budget_item_id = :id', { id })
      .getRawOne();

    // Sum allocated_amount from increase_budget_detail
    const increaseBudgetSum = await manager
      .createQueryBuilder()
      .select('SUM(increase_budget_detail.allocated_amount)', 'total')
      .from('increase_budget_details', 'increase_budget_detail')
      .where('increase_budget_detail.budget_item_id = :id', { id })
      .getRawOne();

    const total =
      Number(increaseBudgetSum.total) - Number(documentTransactionSum.total);

    // Add sums to the result
    return total;
  }

  async getTotal(id: number, manager: EntityManager): Promise<number> {
    const result = await manager
      .createQueryBuilder()
      .select('purchase_order_items.total', 'total')
      .from('purchase_order_items', 'purchase_order_items')
      .where('purchase_order_items.id = :id', { id })
      .getRawOne();

    if (!result || result.total === null) {
      return 0;
    }

    return Number(result.total);
  }

  async getBudgetItem(
    query: BudgetItemQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<BudgetItemEntity>> {
    const queryBuilder = await this.createBaseQueryBudgetItem(manager, query);
    query.sort_by = 'budget_items.id';

    const data = await this._paginationService.paginate(
      queryBuilder,
      query,
      this._dataAccessMapper.toEntity.bind(this._dataAccessMapper),
      this.getFilterOptions(),
    );
    return data;
  }

  private createBaseQueryBudgetItem(
    manager: EntityManager,
    query: BudgetItemQueryDto,
  ) {
    const queryBuilder = manager
      .createQueryBuilder(BudgetItemOrmEntity, 'budget_items')
      .select([
        'budget_items.id',
        'budget_items.name',
        'budget_items.budget_account_id',
        'budget_items.created_at',
        'budget_items.updated_at',
      ])
      .innerJoin('budget_items.budget_accounts', 'budget_accounts')
      .leftJoin('budget_accounts.departments', 'departments')
      .addSelect([
        'budget_accounts.id',
        'budget_accounts.name',
        'budget_accounts.code',
        'budget_accounts.fiscal_year',
        'budget_accounts.department_id',
        'budget_accounts.created_at',
        'budget_accounts.updated_at',
        'departments.id',
        'departments.name',
        'departments.code',
        'departments.department_head_id',
        'departments.created_at',
        'departments.updated_at',
      ]);

    if (query?.budget_account_id) {
      queryBuilder.where('budget_accounts.id = :budget_account_id', {
        budget_account_id: query.budget_account_id,
      });
    }

    return queryBuilder;
  }
}
