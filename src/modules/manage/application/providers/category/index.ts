import {
  LOCALIZATION_SERVICE,
  TRANSACTION_MANAGER_SERVICE,
  TRANSFORM_RESULT_SERVICE,
} from '@src/common/constants/inject-key.const';
import { TransformResultService } from '@src/common/utils/services/transform-result.service';
import { CategoryService } from '../../services/category.service';
import { TransactionManagerService } from '@src/common/infrastructure/transaction/transaction.service';
import { LocalizationService } from '@src/common/infrastructure/localization/localization.service';
import {
  CATEGORY_APPLICATION_SERVICE,
  READ_CATEGORY_REPOSITORY,
  WRITE_CATEGORY_REPOSITORY,
} from '../../constants/inject-key.const';
import { Provider } from '@nestjs/common';
import { WriteCategoryRepository } from '@src/modules/manage/infrastructure/repositories/category/write.repository';
import { CategoryMapperProviders } from './mapper.provider';
import { CategoryHandlersProviders } from './command.provider';
import { ReadCategoryRepository } from '@src/modules/manage/infrastructure/repositories/category/read.repository';

export const CategoryProvider: Provider[] = [
  ...CategoryHandlersProviders,
  ...CategoryMapperProviders,
  {
    provide: LOCALIZATION_SERVICE,
    useClass: LocalizationService,
  },
  {
    provide: TRANSACTION_MANAGER_SERVICE,
    useClass: TransactionManagerService,
  },
  {
    provide: CATEGORY_APPLICATION_SERVICE,
    useClass: CategoryService,
  },
  {
    provide: WRITE_CATEGORY_REPOSITORY,
    useClass: WriteCategoryRepository,
  },
  {
    provide: READ_CATEGORY_REPOSITORY,
    useClass: ReadCategoryRepository,
  },
  {
    provide: TRANSFORM_RESULT_SERVICE,
    useClass: TransformResultService,
  },
];
