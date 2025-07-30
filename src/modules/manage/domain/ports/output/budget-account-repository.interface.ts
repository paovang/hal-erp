import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { EntityManager } from 'typeorm';
import { BudgetAccountEntity } from '../../entities/budget-account.entity';
import { BudgetAccountQueryDto } from '@src/modules/manage/application/dto/query/budget-account.dto';
import { BudgetAccountId } from '../../value-objects/budget-account-id.vo';
import { DepartmentId } from '../../value-objects/department-id.vo';

export interface IReadBudgetAccountRepository {
  findAll(
    query: BudgetAccountQueryDto,
    manager: EntityManager,
    departmentId?: number,
  ): Promise<ResponseResult<BudgetAccountEntity>>;

  findOne(
    id: BudgetAccountId,
    manager: EntityManager,
  ): Promise<ResponseResult<BudgetAccountEntity>>;

  report(
    id: DepartmentId,
    dto: BudgetAccountQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<BudgetAccountEntity>>;
}

export interface IWriteBudgetAccountRepository {
  create(
    entity: BudgetAccountEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<BudgetAccountEntity>>;

  update(
    entity: BudgetAccountEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<BudgetAccountEntity>>;

  delete(id: BudgetAccountId, manager: EntityManager): Promise<void>;
}
