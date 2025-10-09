import { Provider } from '@nestjs/common';
import {
  INCREASE_BUDGET_DETAIL_APPLICATION_SERVICE,
  READ_INCREASE_BUDGET_DETAIL_REPOSITORY,
  WRITE_INCREASE_BUDGET_DETAIL_REPOSITORY,
} from '../../constants/inject-key.const';
import { WriteIncreaseBudgetDetailRepository } from '@src/modules/manage/infrastructure/repositories/increaseBudgetDetail/write.repository';
import { IncreaseBudgetDetailMapperProviders } from './mapper.provider';
import { LOCALIZATION_SERVICE } from '@src/common/constants/inject-key.const';
import { LocalizationService } from '@src/common/infrastructure/localization/localization.service';
import { IncreaseBudgetDetailHandlersProviders } from './command.provider';
import { IncreaseBudgetDetailService } from '../../services/increase-budget-detail.service';
import { ReadIncreaseBudgetDetailRepository } from '@src/modules/manage/infrastructure/repositories/increaseBudgetDetail/read.repository';

export const IncreaseBudgetDetailProvider: Provider[] = [
  ...IncreaseBudgetDetailHandlersProviders,
  ...IncreaseBudgetDetailMapperProviders,
  {
    provide: LOCALIZATION_SERVICE,
    useClass: LocalizationService,
  },
  {
    provide: INCREASE_BUDGET_DETAIL_APPLICATION_SERVICE,
    useClass: IncreaseBudgetDetailService,
  },
  {
    provide: WRITE_INCREASE_BUDGET_DETAIL_REPOSITORY,
    useClass: WriteIncreaseBudgetDetailRepository,
  },
  {
    provide: READ_INCREASE_BUDGET_DETAIL_REPOSITORY,
    useClass: ReadIncreaseBudgetDetailRepository,
  },
];
