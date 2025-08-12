import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { EntityManager } from 'typeorm';
import { BudgetItemEntity } from '../../entities/budget-item.entity';
import { BudgetItemQueryDto } from '@src/modules/manage/application/dto/query/budget-item.dto';
import { CreateBudgetItemDto } from '@src/modules/manage/application/dto/create/BudgetItem/create.dto';
import { UpdateBudgetItemDto } from '@src/modules/manage/application/dto/create/BudgetItem/update.dto';

export interface IBudgetItemServiceInterface {
  getAll(
    dto: BudgetItemQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<BudgetItemEntity>>;

  getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<BudgetItemEntity>>;

  GetItemId(id: number): Promise<ResponseResult<BudgetItemEntity>>;

  create(
    dto: CreateBudgetItemDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<BudgetItemEntity>>;

  update(
    id: number,
    dto: UpdateBudgetItemDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<BudgetItemEntity>>;

  delete(id: number, manager?: EntityManager): Promise<void>;

  getReportBudget(
    query: BudgetItemQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<BudgetItemEntity>>;
}
