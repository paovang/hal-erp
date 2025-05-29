import { Provider } from '@nestjs/common';
import {
  CURRENCY_APPLICATION_SERVICE,
  READ_CURRENCY_REPOSITORY,
  WRITE_CURRENCY_REPOSITORY,
} from '../../constants/inject-key.const';
import { CurrencyService } from '../../services/currency.service';
import {
  LOCALIZATION_SERVICE,
  TRANSACTION_MANAGER_SERVICE,
  TRANSFORM_RESULT_SERVICE,
} from '@src/common/constants/inject-key.const';
import { TransformResultService } from '@src/common/utils/services/transform-result.service';
import { WriteCurrencyRepository } from '@src/modules/manage/infrastructure/repositories/currency/write.repository';
import { CurrencyHandlersProviders } from './command.provider';
import { CurrencyMapperProviders } from './mapper.provider';
import { ReadCurrencyRepository } from '@src/modules/manage/infrastructure/repositories/currency/read.repository';
import { LocalizationService } from '@src/common/infrastructure/localization/localization.service';
import { TransactionManagerService } from '@src/common/infrastructure/transaction/transaction.service';

export const CurrencyProvider: Provider[] = [
  ...CurrencyHandlersProviders,
  ...CurrencyMapperProviders,
  {
    provide: LOCALIZATION_SERVICE,
    useClass: LocalizationService,
  },
  {
    provide: TRANSACTION_MANAGER_SERVICE,
    useClass: TransactionManagerService,
  },
  {
    provide: CURRENCY_APPLICATION_SERVICE,
    useClass: CurrencyService,
  },
  {
    provide: WRITE_CURRENCY_REPOSITORY,
    useClass: WriteCurrencyRepository,
  },
  {
    provide: READ_CURRENCY_REPOSITORY,
    useClass: ReadCurrencyRepository,
  },
  // {
  //   provide: TRANSFORM_RESULT_SERVICE,
  //   useClass: TransformResultService,
  // },
];
