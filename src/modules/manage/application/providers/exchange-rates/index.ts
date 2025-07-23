import { Provider } from '@nestjs/common';
import {
  EXCHANGE_RATE_APPLICATION_SERVICE,
  READ_EXCHANGE_RATE_REPOSITORY,
  WRITE_EXCHANGE_RATE_REPOSITORY,
} from '../../constants/inject-key.const';
import {
  LOCALIZATION_SERVICE,
  TRANSACTION_MANAGER_SERVICE,
} from '@src/common/constants/inject-key.const';
import { ExchangeRateHandlersProviders } from './command.provider';
import { ExchangeRateMapperProviders } from './mapper.provider';
import { LocalizationService } from '@src/common/infrastructure/localization/localization.service';
import { TransactionManagerService } from '@src/common/infrastructure/transaction/transaction.service';
import { ExchangeRateService } from '../../services/exchange-rate.service';
import { WriteExchangeRateRepository } from '@src/modules/manage/infrastructure/repositories/exchange-rates/write.repository';
import { ReadExchangeRateRepository } from '@src/modules/manage/infrastructure/repositories/exchange-rates/read.repository';

export const ExchangeRateProvider: Provider[] = [
  ...ExchangeRateHandlersProviders,
  ...ExchangeRateMapperProviders,
  {
    provide: LOCALIZATION_SERVICE,
    useClass: LocalizationService,
  },
  {
    provide: TRANSACTION_MANAGER_SERVICE,
    useClass: TransactionManagerService,
  },
  {
    provide: EXCHANGE_RATE_APPLICATION_SERVICE,
    useClass: ExchangeRateService,
  },
  {
    provide: WRITE_EXCHANGE_RATE_REPOSITORY,
    useClass: WriteExchangeRateRepository,
  },
  {
    provide: READ_EXCHANGE_RATE_REPOSITORY,
    useClass: ReadExchangeRateRepository,
  },
  // {
  //   provide: TRANSFORM_RESULT_SERVICE,
  //   useClass: TransformResultService,
  // },
];
