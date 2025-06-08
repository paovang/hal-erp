import { Inject, Injectable } from '@nestjs/common';
import { IReadBudgetItemDetailRepository } from '@src/modules/manage/domain/ports/output/budget-item-detail-repository.interface';
import { BudgetItemDetailDataAccessMapper } from '../../mappers/budget-item-detail.mapper';
import { PAGINATION_SERVICE } from '@src/common/constants/inject-key.const';
import {
  FilterOptions,
  IPaginationService,
  ResponseResult,
} from '@src/common/infrastructure/pagination/pagination.interface';
import { BudgetItemDetailQueryDto } from '@src/modules/manage/application/dto/query/budget-item-detail.dto';
import { EntityManager } from 'typeorm';
import { BudgetItemDetailEntity } from '@src/modules/manage/domain/entities/budget-item-detail.entity';
import { BudgetItemDetailOrmEntity } from '@src/common/infrastructure/database/typeorm/budget-item-detail.orm';
import { BudgetItemDetailId } from '../../../domain/value-objects/budget-item-detail-rule-id.vo';

@Injectable()
export class ReadBudgetItemDetailRepository
  implements IReadBudgetItemDetailRepository
{
  constructor(
    private readonly _dataAccessMapper: BudgetItemDetailDataAccessMapper,
    @Inject(PAGINATION_SERVICE)
    private readonly _paginationService: IPaginationService,
  ) {}

  async findAll(
    id: number,
    query: BudgetItemDetailQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<BudgetItemDetailEntity>> {
    const queryBuilder = await this.createBaseQuery(manager, id);
    query.sort_by = 'budget_item_details.id';

    const data = await this._paginationService.paginate(
      queryBuilder,
      query,
      this._dataAccessMapper.toEntity.bind(this._dataAccessMapper),
      this.getFilterOptions(),
    );
    console.log('object', data);
    return data;
  }

  private createBaseQuery(manager: EntityManager, id?: number) {
    const qb = manager
      .createQueryBuilder(BudgetItemDetailOrmEntity, 'budget_item_details')
      .leftJoin('budget_item_details.provinces', 'provinces')
      .addSelect([
        'provinces.id',
        'provinces.name',
        'provinces.created_at',
        'provinces.updated_at',
      ]);

    if (id) {
      qb.where('budget_item_details.budget_item_id = :id', {
        id,
      });
    }

    return qb;
  }

  private getFilterOptions(): FilterOptions {
    return {
      searchColumns: ['budget_item_details.name', 'provinces.name'],
      dateColumn: '',
      filterByColumns: [],
    };
  }

  async findOne(
    id: BudgetItemDetailId,
    manager: EntityManager,
  ): Promise<ResponseResult<BudgetItemDetailEntity>> {
    const item = await this.createBaseQuery(manager)
      .where('budget_item_details.id = :id', { id: id.value })
      .getOneOrFail();

    return this._dataAccessMapper.toEntity(item);
  }
}
