import { Provider } from '@nestjs/common';
import { CurrencyDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/currency.mapper';
import { CurrencyDataMapper } from '../../mappers/currency.mapper';

export const CurrencyMapperProviders: Provider[] = [
  CurrencyDataAccessMapper,
  CurrencyDataMapper,
];
