import { EntityManager } from 'typeorm';
import { BudgetApprovalRuleEntity } from '../../entities/budget-approval-rule.entity';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { BudgetApprovalRuleQueryDto } from '@src/modules/manage/application/dto/query/budget-approval-rule.dto';
import { BudgetApprovalRuleId } from '../../value-objects/budget-approval-rule-id.vo';

export interface IReadBudgetApprovalRuleRepository {
  findAll(
    query: BudgetApprovalRuleQueryDto,
    manager: EntityManager,
    departmentId?: number,
    company_id?: number,
    roles?: string[],
  ): Promise<ResponseResult<BudgetApprovalRuleEntity>>;

  findOne(
    id: BudgetApprovalRuleId,
    manager: EntityManager,
  ): Promise<ResponseResult<BudgetApprovalRuleEntity>>;
}

export interface IWriteBudgetApprovalRuleRepository {
  create(
    entity: BudgetApprovalRuleEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<BudgetApprovalRuleEntity>>;

  update(
    entity: BudgetApprovalRuleEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<BudgetApprovalRuleEntity>>;

  delete(id: BudgetApprovalRuleId, manager: EntityManager): Promise<void>;
}
