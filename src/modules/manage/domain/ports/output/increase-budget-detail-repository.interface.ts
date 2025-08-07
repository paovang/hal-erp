import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { IncreaseBudgetDetailEntity } from '../../entities/increase-budget-detail.entity';
import { EntityManager } from 'typeorm';

export interface IWriteIncreaseBudgetDetailRepository {
  create(
    entity: IncreaseBudgetDetailEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<IncreaseBudgetDetailEntity>>;
}
