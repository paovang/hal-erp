import { Provider } from '@nestjs/common';
import {
  LOCALIZATION_SERVICE,
  TRANSACTION_MANAGER_SERVICE,
  TRANSFORM_RESULT_SERVICE,
} from '@src/common/constants/inject-key.const';
import { TransformResultService } from '@src/common/utils/services/transform-result.service';
import { VendorProductHandlersProviders } from './command.provider';
import { VendorProductMapperProviders } from './mapper.provider';
import {
  READ_VENDOR_PRODUCT_REPOSITORY,
  VENDOR_PRODUCT_APPLICATION_SERVICE,
  WRITE_VENDOR_PRODUCT_REPOSITORY,
} from '../../constants/inject-key.const';
import { VendorProductService } from '../../services/vendor-product.service';
import { WriteVendorProductRepository } from '@src/modules/manage/infrastructure/repositories/vendor-product/write.repository';
import { ReadVendorProductRepository } from '@src/modules/manage/infrastructure/repositories/vendor-product/read.repository';
import { LocalizationService } from '@src/common/infrastructure/localization/localization.service';
import { TransactionManagerService } from '@src/common/infrastructure/transaction/transaction.service';

export const VendorProductProvider: Provider[] = [
  ...VendorProductHandlersProviders,
  ...VendorProductMapperProviders,
  {
    provide: LOCALIZATION_SERVICE,
    useClass: LocalizationService,
  },
  {
    provide: TRANSACTION_MANAGER_SERVICE,
    useClass: TransactionManagerService,
  },
  {
    provide: VENDOR_PRODUCT_APPLICATION_SERVICE,
    useClass: VendorProductService,
  },
  {
    provide: WRITE_VENDOR_PRODUCT_REPOSITORY,
    useClass: WriteVendorProductRepository,
  },
  {
    provide: READ_VENDOR_PRODUCT_REPOSITORY,
    useClass: ReadVendorProductRepository,
  },
  // {
  //   provide: TRANSFORM_RESULT_SERVICE,
  //   useClass: TransformResultService,
  // },
];