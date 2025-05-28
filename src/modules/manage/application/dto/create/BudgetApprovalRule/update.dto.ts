import { PartialType } from '@nestjs/swagger';
import { CreateBudgetApprovalRuleDto } from './create.dto';

export class UpdateBudgetApprovalRuleDto extends PartialType(
  CreateBudgetApprovalRuleDto,
) {}
