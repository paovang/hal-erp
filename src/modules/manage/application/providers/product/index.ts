import { ProductHandlersProviders } from './command.provider';
import { MapperProviders } from './mapper.provider';
import { Provider } from '@nestjs/common';
import {
  PRODUCT_APPLICATION_SERVICE,
  READ_PRODUCT_REPOSITORY,
  WRITE_PRODUCT_REPOSITORY,
} from '../../constants/inject-key.const';
import { ProductService } from '../../services/product.service';
import { ReadProductRepository } from '../../../infrastructure/repositories/product/read.repository';
import { WriteProductRepository } from '../../../infrastructure/repositories/product/write.repository';
import {
  LOCALIZATION_SERVICE,
  TRANSACTION_MANAGER_SERVICE,
} from '@src/common/constants/inject-key.const';
import { LocalizationService } from '@src/common/infrastructure/localization/localization.service';
import { TransactionManagerService } from '@src/common/infrastructure/transaction/transaction.service';

export const ProductProviders: Provider[] = [
  ...ProductHandlersProviders,
  ...MapperProviders,
  {
    provide: LOCALIZATION_SERVICE,
    useClass: LocalizationService,
  },
  {
    provide: TRANSACTION_MANAGER_SERVICE,
    useClass: TransactionManagerService,
  },
  {
    provide: PRODUCT_APPLICATION_SERVICE,
    useClass: ProductService,
  },
  {
    provide: READ_PRODUCT_REPOSITORY,
    useClass: ReadProductRepository,
  },
  {
    provide: WRITE_PRODUCT_REPOSITORY,
    useClass: WriteProductRepository,
  },
];