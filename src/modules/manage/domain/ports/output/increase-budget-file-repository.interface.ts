import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { EntityManager } from 'typeorm';
import { IncreaseBudgetFileEntity } from '../../entities/increase-budget-file.entity';
import { IncreaseBudgetFileId } from '../../value-objects/increase-budget-file-id.vo';

export interface IWriteIncreaseBudgetFileRepository {
  create(
    entity: IncreaseBudgetFileEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<IncreaseBudgetFileEntity>>;

  update(
    entity: IncreaseBudgetFileEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<IncreaseBudgetFileEntity>>;

  delete(id: IncreaseBudgetFileId, manager: EntityManager): Promise<void>;
}
