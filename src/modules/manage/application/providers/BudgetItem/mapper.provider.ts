import { Provider } from '@nestjs/common';
import { BudgetItemDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/budget-item.mapper';
import { BudgetItemDataMapper } from '../../mappers/budget-item.mapper';

export const BudgetItemMapperProviders: Provider[] = [
  BudgetItemDataAccessMapper,
  BudgetItemDataMapper,
];
