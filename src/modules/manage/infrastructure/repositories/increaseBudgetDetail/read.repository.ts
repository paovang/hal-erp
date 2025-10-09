import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IncreaseBudgetDetailOrmEntity } from '@src/common/infrastructure/database/typeorm/increase-budget-detail.orm';
import { IReadIncreaseBudgetDetailRepository } from '@src/modules/manage/domain/ports/output/increase-budget-detail-repository.interface';
import { EntityManager, Repository } from 'typeorm';
import { IncreaseBudgetDetailDataAccessMapper } from '../../mappers/increase-budget-detail.mapper';
import {
  FilterOptions,
  IPaginationService,
  ResponseResult,
} from '@src/common/infrastructure/pagination/pagination.interface';
import { PAGINATION_SERVICE } from '@src/common/constants/inject-key.const';
import { IncreaseBudgetId } from '@src/modules/manage/domain/value-objects/increase-budget-id.vo';
import { IncreaseBudgetDetailQueryDto } from '@src/modules/manage/application/dto/query/increase-budget-detail.dto';
import { IncreaseBudgetDetailEntity } from '@src/modules/manage/domain/entities/increase-budget-detail.entity';
import {
  selectBudgetAccounts,
  selectBudgetItems,
  selectDepartments,
} from '@src/common/constants/select-field';
import { IncreaseBudgetDetailId } from '@src/modules/manage/domain/value-objects/increase-budget-detail-id.vo';

@Injectable()
export class ReadIncreaseBudgetDetailRepository
  implements IReadIncreaseBudgetDetailRepository
{
  constructor(
    @InjectRepository(IncreaseBudgetDetailOrmEntity)
    private readonly _increaseBudgetOrm: Repository<IncreaseBudgetDetailOrmEntity>,
    private readonly _dataAccessMapper: IncreaseBudgetDetailDataAccessMapper,
    @Inject(PAGINATION_SERVICE)
    private readonly _paginationService: IPaginationService,
  ) {}

  async sum_total(
    id: IncreaseBudgetId,
    manager: EntityManager,
  ): Promise<number> {
    const total = await manager
      .createQueryBuilder(IncreaseBudgetDetailOrmEntity, 'detail')
      .select('SUM(detail.allocated_amount)', 'sum_total')
      .where('detail.increase_budget_id = :id', { id: id.value })
      .getRawOne();

    const sumAllocatedAmount = Number(total.sum_total) || 0;
    return sumAllocatedAmount;
  }

  async findAll(
    id: number,
    query: IncreaseBudgetDetailQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<IncreaseBudgetDetailEntity>> {
    const queryBuilder = await this.createBaseQuery(manager, id);
    query.sort_by = 'increase_budget_details.id';

    const data = await this._paginationService.paginate(
      queryBuilder,
      query,
      this._dataAccessMapper.toEntity.bind(this._dataAccessMapper),
      this.getFilterOptions(),
    );
    return data;
  }

  private createBaseQuery(manager: EntityManager, id?: number) {
    const selectFields = [
      ...selectBudgetItems,
      ...selectBudgetAccounts,
      ...selectDepartments,
    ];
    const queryBuilder = manager
      .createQueryBuilder(
        IncreaseBudgetDetailOrmEntity,
        'increase_budget_details',
      )
      .leftJoin('increase_budget_details.budget_item', 'budget_items')
      .leftJoin('budget_items.budget_accounts', 'budget_accounts')
      .leftJoin('budget_accounts.departments', 'departments')
      .where('increase_budget_details.increase_budget_id = :id', { id: id })
      .addSelect(selectFields);

    return queryBuilder;
  }

  private getFilterOptions(): FilterOptions {
    return {
      searchColumns: [],
      dateColumn: '',
      filterByColumns: [],
    };
  }

  async findOne(
    id: IncreaseBudgetDetailId,
    manager: EntityManager,
  ): Promise<ResponseResult<IncreaseBudgetDetailEntity>> {
    const item = await this.createBaseQuery(manager)
      .where('increase_budget_details.id = :id', { id: id.value })
      .getOneOrFail();

    return this._dataAccessMapper.toEntity(item);
  }
}
