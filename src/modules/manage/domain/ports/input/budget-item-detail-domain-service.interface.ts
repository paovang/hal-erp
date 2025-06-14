import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { EntityManager } from 'typeorm';
import { BudgetItemDetailEntity } from '../../entities/budget-item-detail.entity';
import { BudgetItemDetailQueryDto } from '@src/modules/manage/application/dto/query/budget-item-detail.dto';
import { CreateBudgetItemDetailDto } from '@src/modules/manage/application/dto/create/budgetItemDetail/create.dto';

export interface IBudgetItemDetailServiceInterface {
  getAll(
    id: number,
    dto: BudgetItemDetailQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<BudgetItemDetailEntity>>;

  getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<BudgetItemDetailEntity>>;

  create(
    id: number,
    dto: CreateBudgetItemDetailDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<BudgetItemDetailEntity>>;

  delete(id: number, manager?: EntityManager): Promise<void>;
}
