import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { EntityManager } from 'typeorm';
import { BudgetItemEntity } from '../../entities/budget-item.entity';
import { BudgetItemQueryDto } from '@src/modules/manage/application/dto/query/budget-item.dto';
import { BudgetItemId } from '../../value-objects/budget-item-id.vo';
export interface IReadBudgetItemRepository {
  findAll(
    query: BudgetItemQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<BudgetItemEntity>>;

  findOne(
    id: BudgetItemId,
    manager: EntityManager,
  ): Promise<ResponseResult<BudgetItemEntity>>;
}

export interface IWriteBudgetItemRepository {
  create(
    entity: BudgetItemEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<BudgetItemEntity>>;

  update(
    entity: BudgetItemEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<BudgetItemEntity>>;

  updateColumns(
    entity: BudgetItemEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<BudgetItemEntity>>;

  delete(id: BudgetItemId, manager: EntityManager): Promise<void>;
}
