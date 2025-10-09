import { Provider } from '@nestjs/common';
import { BudgetAccountDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/budget-account.mapper';
import { BudgetAccountDataMapper } from '../../mappers/budget-account.mapper';

export const BudgetAccountMapperProviders: Provider[] = [
  BudgetAccountDataAccessMapper,
  BudgetAccountDataMapper,
];
