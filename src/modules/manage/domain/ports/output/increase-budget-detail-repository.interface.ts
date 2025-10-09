import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { IncreaseBudgetDetailEntity } from '../../entities/increase-budget-detail.entity';
import { EntityManager } from 'typeorm';
import { IncreaseBudgetDetailId } from '../../value-objects/increase-budget-detail-id.vo';
import { IncreaseBudgetId } from '../../value-objects/increase-budget-id.vo';
import { IncreaseBudgetDetailQueryDto } from '@src/modules/manage/application/dto/query/increase-budget-detail.dto';

export interface IWriteIncreaseBudgetDetailRepository {
  create(
    entity: IncreaseBudgetDetailEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<IncreaseBudgetDetailEntity>>;

  update(
    entity: IncreaseBudgetDetailEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<IncreaseBudgetDetailEntity>>;

  delete(id: IncreaseBudgetDetailId, manager: EntityManager): Promise<void>;
}

export interface IReadIncreaseBudgetDetailRepository {
  findAll(
    id: number,
    query: IncreaseBudgetDetailQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<IncreaseBudgetDetailEntity>>;

  findOne(
    id: IncreaseBudgetDetailId,
    manager: EntityManager,
  ): Promise<ResponseResult<IncreaseBudgetDetailEntity>>;

  sum_total(id: IncreaseBudgetId, manager: EntityManager): Promise<number>;
}
