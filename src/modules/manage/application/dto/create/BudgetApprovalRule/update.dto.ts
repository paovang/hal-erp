import { PartialType } from '@nestjs/swagger';
import { CreateBudgetApprovalRuleDto } from './create.dto';
// rest
export class UpdateBudgetApprovalRuleDto extends PartialType(
  CreateBudgetApprovalRuleDto,
) {}
