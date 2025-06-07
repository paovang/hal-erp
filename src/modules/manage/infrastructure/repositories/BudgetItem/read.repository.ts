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
      .leftJoinAndSelect(
        'budget_items.budget_item_details',
        'budget_item_details',
      );
  }

  private getFilterOptions(): FilterOptions {
    return {
      searchColumns: ['budget_items.name'],
      dateColumn: '',
      filterByColumns: [],
    };
  }
}
