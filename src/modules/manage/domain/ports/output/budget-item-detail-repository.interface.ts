import { EntityManager } from 'typeorm';
import { BudgetItemDetailEntity } from '../../entities/budget-item-detail.entity';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { BudgetItemDetailId } from '../../value-objects/budget-item-detail-rule-id.vo';
import { BudgetItemDetailQueryDto } from '@src/modules/manage/application/dto/query/budget-item-detail.dto';

export interface IReadBudgetItemDetailRepository {
  findAll(
    id: number,
    query: BudgetItemDetailQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<BudgetItemDetailEntity>>;

  findOne(
    id: BudgetItemDetailId,
    manager: EntityManager,
  ): Promise<ResponseResult<BudgetItemDetailEntity>>;
}

export interface IWriteBudgetItemDetailRepository {
  create(
    entity: BudgetItemDetailEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<BudgetItemDetailEntity>>;

  //   update(
  //     entity: BudgetItemDetailEntity,
  //     manager: EntityManager,
  //   ): Promise<ResponseResult<BudgetItemDetailEntity>>;

  delete(id: BudgetItemDetailId, manager: EntityManager): Promise<void>;
}
