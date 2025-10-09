import { Provider } from '@nestjs/common';
import { ExchangeRateDataMapper } from '../../mappers/exchange-rate.mapper';
import { ExchangeRateDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/exchange-rate.mapper';

export const ExchangeRateMapperProviders: Provider[] = [
  ExchangeRateDataAccessMapper,
  ExchangeRateDataMapper,
];
