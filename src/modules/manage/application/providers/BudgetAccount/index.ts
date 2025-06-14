import { Provider } from '@nestjs/common';
import { BudgetAccountHandlersProviders } from './command.provider';
import { BudgetAccountMapperProviders } from './mapper.provider';
import { LocalizationService } from '@src/common/infrastructure/localization/localization.service';
import {
  LOCALIZATION_SERVICE,
  TRANSACTION_MANAGER_SERVICE,
} from '@src/common/constants/inject-key.const';
import { TransactionManagerService } from '@src/common/infrastructure/transaction/transaction.service';
import {
  BUDGET_ACCOUNT_APPLICATION_SERVICE,
  READ_BUDGET_ACCOUNT_REPOSITORY,
  WRITE_BUDGET_ACCOUNT_REPOSITORY,
} from '../../constants/inject-key.const';
import { BudgetAccountService } from '../../services/budget-account.service';
import { WriteBudgetAccountRepository } from '@src/modules/manage/infrastructure/repositories/BudgetAccount/write.repository';
import { ReadBudgetAccountRepository } from '@src/modules/manage/infrastructure/repositories/BudgetAccount/read.repository';

export const BudgetAccountProvider: Provider[] = [
  ...BudgetAccountHandlersProviders,
  ...BudgetAccountMapperProviders,

  {
    provide: LOCALIZATION_SERVICE,
    useClass: LocalizationService,
  },
  {
    provide: TRANSACTION_MANAGER_SERVICE,
    useClass: TransactionManagerService,
  },
  {
    provide: BUDGET_ACCOUNT_APPLICATION_SERVICE,
    useClass: BudgetAccountService,
  },
  {
    provide: WRITE_BUDGET_ACCOUNT_REPOSITORY,
    useClass: WriteBudgetAccountRepository,
  },
  {
    provide: READ_BUDGET_ACCOUNT_REPOSITORY,
    useClass: ReadBudgetAccountRepository,
  },
];
