import { Provider } from '@nestjs/common';
import { WRITE_INCREASE_BUDGET_DETAIL_REPOSITORY } from '../../constants/inject-key.const';
import { WriteIncreaseBudgetDetailRepository } from '@src/modules/manage/infrastructure/repositories/increaseBudgetDetail/write.repository';
import { IncreaseBudgetDetailMapperProviders } from './mapper.provider';

export const IncreaseBudgetDetailProvider: Provider[] = [
  ...IncreaseBudgetDetailMapperProviders,
  {
    provide: WRITE_INCREASE_BUDGET_DETAIL_REPOSITORY,
    useClass: WriteIncreaseBudgetDetailRepository,
  },
];
