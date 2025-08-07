import { Provider } from '@nestjs/common';
import { WRITE_INCREASE_BUDGET_FILE_REPOSITORY } from '../../constants/inject-key.const';
import { WriteIncreaseBudgetFileRepository } from '@src/modules/manage/infrastructure/repositories/increaseBudgetFile/write.repository';
import { IncreaseBudgetFileMapperProviders } from './mapper.provider';

export const IncreaseBudgetFileProvider: Provider[] = [
  ...IncreaseBudgetFileMapperProviders,
  {
    provide: WRITE_INCREASE_BUDGET_FILE_REPOSITORY,
    useClass: WriteIncreaseBudgetFileRepository,
  },
];
