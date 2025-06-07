// export interface IReadCategoryRepository {
//   findAll(
//     query: CategoryQueryDto,
//     manager: EntityManager,
//   ): Promise<ResponseResult<CategoryEntity>>;

import { EntityManager } from 'typeorm';
import { BudgetItemDetailEntity } from '../../entities/budget-item-detail.entity';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';

//   findOne(
//     id: CategoryId,
//     manager: EntityManager,
//   ): Promise<ResponseResult<CategoryEntity>>;
// }

export interface IWriteBudgetItemDetailRepository {
  create(
    entity: BudgetItemDetailEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<BudgetItemDetailEntity>>;

  //   update(
  //     entity: BudgetItemDetailEntity,
  //     manager: EntityManager,
  //   ): Promise<ResponseResult<BudgetItemDetailEntity>>;

  //   delete(id: CategoryId, manager: EntityManager): Promise<void>;
}
