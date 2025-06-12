import { Inject, Injectable } from '@nestjs/common';
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
    const queryBuilder = await this.createBaseQuery(manager);
    query.sort_by = 'budget_items.id';

    const data = await this._paginationService.paginate(
      queryBuilder,
      query,
      this._dataAccessMapper.toEntity.bind(this._dataAccessMapper),
      this.getFilterOptions(),
    );
    return data;
  }

  private createBaseQuery(manager: EntityManager) {
    return manager
      .createQueryBuilder(BudgetItemOrmEntity, 'budget_items')
      .select([
        'budget_items.id',
        'budget_items.name',
        'budget_items.budget_account_id',
        'budget_items.allocated_amount',
        'budget_items.created_at',
        'budget_items.updated_at',
        'budget_item_details.id',
        'budget_item_details.budget_item_id',
        'budget_item_details.province_id',
        'budget_item_details.name',
        'budget_item_details.allocated_amount',
        'budget_item_details.description',
        'budget_item_details.created_at',
        'budget_item_details.updated_at',
      ])
      .leftJoin('budget_items.budget_item_details', 'budget_item_details')
      .loadRelationCountAndMap(
        'budget_items.details_count',
        'budget_items.budget_item_details',
        'bid',
      )
      .leftJoin('budget_item_details.provinces', 'provinces')
      .addSelect([
        'provinces.id',
        'provinces.name',
        'provinces.created_at',
        'provinces.updated_at',
      ]);
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
}
