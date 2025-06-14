import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { EntityManager } from 'typeorm';
import { BudgetApprovalRuleEntity } from '../../entities/budget-approval-rule.entity';
import { BudgetApprovalRuleQueryDto } from '@src/modules/manage/application/dto/query/budget-approval-rule.dto';
import { CreateBudgetApprovalRuleDto } from '@src/modules/manage/application/dto/create/BudgetApprovalRule/create.dto';
import { UpdateBudgetApprovalRuleDto } from '@src/modules/manage/application/dto/create/BudgetApprovalRule/update.dto';

export interface IBudgetApprovalRuleServiceInterface {
  getAll(
    dto: BudgetApprovalRuleQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<BudgetApprovalRuleEntity>>;

  getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<BudgetApprovalRuleEntity>>;

  create(
    dto: CreateBudgetApprovalRuleDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<BudgetApprovalRuleEntity>>;

  update(
    id: number,
    dto: UpdateBudgetApprovalRuleDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<BudgetApprovalRuleEntity>>;

  delete(id: number, manager?: EntityManager): Promise<void>;
}
