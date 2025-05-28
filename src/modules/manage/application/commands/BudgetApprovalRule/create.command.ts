import { EntityManager } from 'typeorm';
import { CreateBudgetApprovalRuleDto } from '../../dto/create/BudgetApprovalRule/create.dto';

export class CreateCommand {
  constructor(
    public readonly dto: CreateBudgetApprovalRuleDto,
    public readonly manager: EntityManager,
  ) {}
}
