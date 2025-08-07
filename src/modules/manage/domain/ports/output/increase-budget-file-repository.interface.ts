import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { EntityManager } from 'typeorm';
import { IncreaseBudgetFileEntity } from '../../entities/increase-budget-file.entity';

export interface IWriteIncreaseBudgetFileRepository {
  create(
    entity: IncreaseBudgetFileEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<IncreaseBudgetFileEntity>>;
}
