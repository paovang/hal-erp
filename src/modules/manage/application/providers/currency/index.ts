import { Provider } from '@nestjs/common';
import {
  CURRENCY_APPLICATION_SERVICE,
  READ_CURRENCY_REPOSITORY,
  WRITE_CURRENCY_REPOSITORY,
} from '../../constants/inject-key.const';
import { CurrencyService } from '../../services/currency.service';
import { TRANSFORM_RESULT_SERVICE } from '@src/common/constants/inject-key.const';
import { TransformResultService } from '@src/common/utils/services/transform-result.service';
import { WriteCurrencyRepository } from '@src/modules/manage/infrastructure/repositories/currency/write.repository';
import { CurrencyHandlersProviders } from './command.provider';
import { CurrencyMapperProviders } from './mapper.provider';
import { ReadCurrencyRepository } from '@src/modules/manage/infrastructure/repositories/currency/read.repository';

export const CurrencyProvider: Provider[] = [
  ...CurrencyHandlersProviders,
  ...CurrencyMapperProviders,
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
  {
    provide: TRANSFORM_RESULT_SERVICE,
    useClass: TransformResultService,
  },
];
