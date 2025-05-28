import { EntityManager } from 'typeorm';
import { UpdateBudgetApprovalRuleDto } from '../../dto/create/BudgetApprovalRule/update.dto';

export class UpdateCommand {
  constructor(
    public readonly id: number,
    public readonly dto: UpdateBudgetApprovalRuleDto,
    public readonly manager: EntityManager,
  ) {}
}
