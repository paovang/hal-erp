import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { EntityManager } from 'typeorm';
import { BudgetItemEntity } from '../../entities/budget-item.entity';
import { CreateBudgetItemDto } from '@src/modules/manage/application/dto/create/BudgetItem/create.dto';
import { BudgetItemQueryDto } from '@src/modules/manage/application/dto/query/budget-item.dto';

export interface IBudgetItemServiceInterface {
  getAll(
    dto: BudgetItemQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<BudgetItemEntity>>;

  getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<BudgetItemEntity>>;

  create(
    dto: CreateBudgetItemDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<BudgetItemEntity>>;

  //   update(
  //     id: number,
  //     dto: UpdateCategoryDto,
  //     manager?: EntityManager,
  //   ): Promise<ResponseResult<CategoryEntity>>;

  //   delete(id: number, manager?: EntityManager): Promise<void>;
}
