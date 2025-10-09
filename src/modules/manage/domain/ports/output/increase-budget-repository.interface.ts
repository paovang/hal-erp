import { EntityManager } from 'typeorm';
import { IncreaseBudgetEntity } from '../../entities/increase-budget.entity';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { IncreaseBudgetQueryDto } from '@src/modules/manage/application/dto/query/increase-budget.dto';
import { IncreaseBudgetId } from '../../value-objects/increase-budget-id.vo';

export interface IWriteIncreaseBudgetRepository {
  create(
    entity: IncreaseBudgetEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<IncreaseBudgetEntity>>;

  update(
    entity: IncreaseBudgetEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<IncreaseBudgetEntity>>;

  delete(id: IncreaseBudgetId, manager: EntityManager): Promise<void>;
}

export interface IReadIncreaseBudgetRepository {
  findAll(
    query: IncreaseBudgetQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<IncreaseBudgetEntity>>;

  findOne(
    id: IncreaseBudgetId,
    manager: EntityManager,
  ): Promise<ResponseResult<IncreaseBudgetEntity>>;
}
