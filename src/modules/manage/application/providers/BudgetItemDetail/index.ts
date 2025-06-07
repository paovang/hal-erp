import { Provider } from '@nestjs/common';
import { BudgetItemDetailHandlersProviders } from './command.provider';
import { BudgetItemDetailMapperProviders } from './mapper.provider';
import {
  LOCALIZATION_SERVICE,
  TRANSACTION_MANAGER_SERVICE,
} from '@src/common/constants/inject-key.const';
import { LocalizationService } from '@src/common/infrastructure/localization/localization.service';
import { TransactionManagerService } from '@src/common/infrastructure/transaction/transaction.service';
import { WRITE_BUDGET_ITEM_DETAIL_REPOSITORY } from '../../constants/inject-key.const';
import { WriteBudgetItemDetailRepository } from '@src/modules/manage/infrastructure/repositories/BudgetItemDetail/write.repository';

export const BudgetItemDetailProvider: Provider[] = [
  ...BudgetItemDetailHandlersProviders,
  ...BudgetItemDetailMapperProviders,
  {
    provide: LOCALIZATION_SERVICE,
    useClass: LocalizationService,
  },
  {
    provide: TRANSACTION_MANAGER_SERVICE,
    useClass: TransactionManagerService,
  },
  //   {
  //     provide: BUDGET_ITEM_DETAIL_APPLICATION_SERVICE,
  //     useClass: BudgetItemDetailService,
  //   },
  {
    provide: WRITE_BUDGET_ITEM_DETAIL_REPOSITORY,
    useClass: WriteBudgetItemDetailRepository,
  },
  //   {
  //     provide: READ_BUDGET_ITEM_DETAIL_REPOSITORY,
  //     useClass: ReadBudgetItemDetailRepository,
  //   },
];
