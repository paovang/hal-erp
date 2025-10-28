import { ProductTypeHandlersProviders } from './command.provider';
import { ProductTypeMapperProviders } from './mapper.provider';
import { Provider } from '@nestjs/common';
import {
  PRODUCT_TYPE_APPLICATION_SERVICE,
  READ_PRODUCT_TYPE_REPOSITORY,
  WRITE_PRODUCT_TYPE_REPOSITORY,
} from '../../constants/inject-key.const';
import { ProductTypeService } from '../../services/product-type.service';
import { ReadProductTypeRepository } from '../../../infrastructure/repositories/product-type/read.repository';
import { WriteProductTypeRepository } from '../../../infrastructure/repositories/product-type/write.repository';
import {
  LOCALIZATION_SERVICE,
  TRANSACTION_MANAGER_SERVICE,
} from '@src/common/constants/inject-key.const';
import { LocalizationService } from '@src/common/infrastructure/localization/localization.service';
import { TransactionManagerService } from '@src/common/infrastructure/transaction/transaction.service';

export const ProductTypeProvider: Provider[] = [
  ...ProductTypeHandlersProviders,
  ...ProductTypeMapperProviders,
  {
    provide: LOCALIZATION_SERVICE,
    useClass: LocalizationService,
  },
  {
    provide: TRANSACTION_MANAGER_SERVICE,
    useClass: TransactionManagerService,
  },
  {
    provide: PRODUCT_TYPE_APPLICATION_SERVICE,
    useClass: ProductTypeService,
  },
  {
    provide: READ_PRODUCT_TYPE_REPOSITORY,
    useClass: ReadProductTypeRepository,
  },
  {
    provide: WRITE_PRODUCT_TYPE_REPOSITORY,
    useClass: WriteProductTypeRepository,
  },
];
