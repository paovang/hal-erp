import { Provider } from '@nestjs/common';
import { IncreaseBudgetDetailDataMapper } from '../../mappers/increase-budget-detail.mapper';
import { IncreaseBudgetDetailDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/increase-budget-detail.mapper';

export const IncreaseBudgetDetailMapperProviders: Provider[] = [
  IncreaseBudgetDetailDataAccessMapper,
  IncreaseBudgetDetailDataMapper,
];
