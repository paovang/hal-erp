import { Provider } from '@nestjs/common';
import { IncreaseBudgetFileDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/increase-budget-file.mapper';
import { IncreaseBudgetFileDataMapper } from '../../mappers/increase-budget-file.mapper';

export const IncreaseBudgetFileMapperProviders: Provider[] = [
  IncreaseBudgetFileDataAccessMapper,
  IncreaseBudgetFileDataMapper,
];
