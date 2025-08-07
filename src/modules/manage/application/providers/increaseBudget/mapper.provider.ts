import { Provider } from '@nestjs/common';
import { IncreaseBudgetDataMapper } from '../../mappers/increase-budget.mapper';
import { IncreaseBudgetDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/increase-budget.mapper';

export const IncreaseBudgetMapperProviders: Provider[] = [
  IncreaseBudgetDataAccessMapper,
  IncreaseBudgetDataMapper,
];
