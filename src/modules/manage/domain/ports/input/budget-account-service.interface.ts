import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { EntityManager } from 'typeorm';
import { BudgetAccountEntity } from '../../entities/budget-account.entity';
import { BudgetAccountQueryDto } from '@src/modules/manage/application/dto/query/budget-account.dto';
import { CreateBudgetAccountDto } from '@src/modules/manage/application/dto/create/budgetAccount/create.dto';
import { UpdateBudgetAccountDto } from '@src/modules/manage/application/dto/create/budgetAccount/update.dto';

export interface IBudgetAccountServiceInterface {
  getAll(
    dto: BudgetAccountQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<BudgetAccountEntity>>;

  getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<BudgetAccountEntity>>;

  create(
    dto: CreateBudgetAccountDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<BudgetAccountEntity>>;

  update(
    id: number,
    dto: UpdateBudgetAccountDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<BudgetAccountEntity>>;

  delete(id: number, manager?: EntityManager): Promise<void>;
}
