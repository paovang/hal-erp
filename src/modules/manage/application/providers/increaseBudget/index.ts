import { Provider } from '@nestjs/common';
import { IncreaseBudgetHandlersProviders } from './command.provider';
import { IncreaseBudgetMapperProviders } from './mapper.provider';
import {
  INCREASE_BUDGET_APPLICATION_SERVICE,
  READ_INCREASE_BUDGET_REPOSITORY,
  WRITE_INCREASE_BUDGET_REPOSITORY,
} from '../../constants/inject-key.const';
import { IncreaseBudgetService } from '../../services/increase-budget.service';
import { WriteIncreaseBudgetRepository } from '@src/modules/manage/infrastructure/repositories/increaseBudget/write.repository';
import { ReadIncreaseBudgetRepository } from '@src/modules/manage/infrastructure/repositories/increaseBudget/read.repository';

export const IncreaseBudgetProvider: Provider[] = [
  ...IncreaseBudgetHandlersProviders,
  ...IncreaseBudgetMapperProviders,
  {
    provide: INCREASE_BUDGET_APPLICATION_SERVICE,
    useClass: IncreaseBudgetService,
  },
  {
    provide: WRITE_INCREASE_BUDGET_REPOSITORY,
    useClass: WriteIncreaseBudgetRepository,
  },
  {
    provide: READ_INCREASE_BUDGET_REPOSITORY,
    useClass: ReadIncreaseBudgetRepository,
  },
];
