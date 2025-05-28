import { EntityManager } from 'typeorm';
import { BudgetApprovalRuleQueryDto } from '../../dto/query/budget-approval-rule.dto';

export class GetAllQuery {
  constructor(
    public readonly dto: BudgetApprovalRuleQueryDto,
    public readonly manager: EntityManager,
  ) {}
}
