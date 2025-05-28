import { Provider } from '@nestjs/common';
import { BudgetApprovalRuleDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/budget-approval-rule.mapper';
import { BudgetApprovalRuleDataMapper } from '../../mappers/budget-approval-rule.mapper';

export const BudgetApprovalRuleMapperProviders: Provider[] = [
  BudgetApprovalRuleDataAccessMapper,
  BudgetApprovalRuleDataMapper,
];
