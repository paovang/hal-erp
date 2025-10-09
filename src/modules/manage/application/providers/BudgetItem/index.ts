import { Provider } from '@nestjs/common';
import { BudgetItemHandlersProviders } from './command.provider';
import { BudgetItemMapperProviders } from './mapper.provider';
import {
  LOCALIZATION_SERVICE,
  TRANSACTION_MANAGER_SERVICE,
} from '@src/common/constants/inject-key.const';
import { LocalizationService } from '@src/common/infrastructure/localization/localization.service';
import { TransactionManagerService } from '@src/common/infrastructure/transaction/transaction.service';
import {
  BUDGET_ITEM_APPLICATION_SERVICE,
  READ_BUDGET_ITEM_REPOSITORY,
  WRITE_BUDGET_ITEM_REPOSITORY,
} from '../../constants/inject-key.const';
import { BudgetItemService } from '../../services/budget-item.service';
import { WriteBudgetItemRepository } from '@src/modules/manage/infrastructure/repositories/BudgetItem/write.repository';
import { ReadBudgetItemRepository } from '@src/modules/manage/infrastructure/repositories/BudgetItem/read.repository';

export const BudgetItemProvider: Provider[] = [
  ...BudgetItemHandlersProviders,
  ...BudgetItemMapperProviders,
  {
    provide: LOCALIZATION_SERVICE,
    useClass: LocalizationService,
  },
  {
    provide: TRANSACTION_MANAGER_SERVICE,
    useClass: TransactionManagerService,
  },
  {
    provide: BUDGET_ITEM_APPLICATION_SERVICE,
    useClass: BudgetItemService,
  },
  {
    provide: WRITE_BUDGET_ITEM_REPOSITORY,
    useClass: WriteBudgetItemRepository,
  },
  {
    provide: READ_BUDGET_ITEM_REPOSITORY,
    useClass: ReadBudgetItemRepository,
  },
];
