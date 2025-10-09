import { Provider } from '@nestjs/common';
import { BudgetApprovalRuleHandlersProviders } from './command.provider';
import { BudgetApprovalRuleMapperProviders } from './mapper.provider';
import {
  LOCALIZATION_SERVICE,
  TRANSACTION_MANAGER_SERVICE,
} from '@src/common/constants/inject-key.const';
import { LocalizationService } from '@src/common/infrastructure/localization/localization.service';
import { TransactionManagerService } from '@src/common/infrastructure/transaction/transaction.service';
import {
  BUDGET_APPROVAL_RULE_APPLICATION_SERVICE,
  READ_BUDGET_APPROVAL_RULE_REPOSITORY,
  WRITE_BUDGET_APPROVAL_RULE_REPOSITORY,
} from '../../constants/inject-key.const';
import { BudgetApprovalRuleService } from '../../services/budget-approval-rule.service';
import { WriteBudgetApprovalRuleRepository } from '@src/modules/manage/infrastructure/repositories/BudgetApprovalRule/write.repository';
import { ReadBudgetApprovalRuleRepository } from '@src/modules/manage/infrastructure/repositories/BudgetApprovalRule/read.repository';

export const BudgetApprovalRuleProvider: Provider[] = [
  ...BudgetApprovalRuleHandlersProviders,
  ...BudgetApprovalRuleMapperProviders,
  {
    provide: LOCALIZATION_SERVICE,
    useClass: LocalizationService,
  },
  {
    provide: TRANSACTION_MANAGER_SERVICE,
    useClass: TransactionManagerService,
  },
  {
    provide: BUDGET_APPROVAL_RULE_APPLICATION_SERVICE,
    useClass: BudgetApprovalRuleService,
  },
  {
    provide: WRITE_BUDGET_APPROVAL_RULE_REPOSITORY,
    useClass: WriteBudgetApprovalRuleRepository,
  },
  {
    provide: READ_BUDGET_APPROVAL_RULE_REPOSITORY,
    useClass: ReadBudgetApprovalRuleRepository,
  },
  // {
  //   provide: TRANSFORM_RESULT_SERVICE,
  //   useClass: TransformResultService,
  // },
];
