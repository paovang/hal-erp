import { Provider } from '@nestjs/common';
import { BudgetItemDetailDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/budget-item-detail.mapper';
import { BudgetItemDetailDataMapper } from '../../mappers/budget-item-detail.mapper';

export const BudgetItemDetailMapperProviders: Provider[] = [
  BudgetItemDetailDataAccessMapper,
  BudgetItemDetailDataMapper,
];
