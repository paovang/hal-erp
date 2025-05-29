import { Provider } from '@nestjs/common';
import {
  LOCALIZATION_SERVICE,
  TRANSACTION_MANAGER_SERVICE,
  TRANSFORM_RESULT_SERVICE,
} from '@src/common/constants/inject-key.const';
import { TransformResultService } from '@src/common/utils/services/transform-result.service';
import { VendorHandlersProviders } from './command.provider';
import { VendorMapperProviders } from './mapper.provider';
import {
  READ_VENDOR_REPOSITORY,
  VENDOR_APPLICATION_SERVICE,
  WRITE_VENDOR_REPOSITORY,
} from '../../constants/inject-key.const';
import { VendorService } from '../../services/vendor.service';
import { WriteVendorRepository } from '@src/modules/manage/infrastructure/repositories/vendor/write.repository';
import { ReadVendorRepository } from '@src/modules/manage/infrastructure/repositories/vendor/read.repository';
import { LocalizationService } from '@src/common/infrastructure/localization/localization.service';
import { TransactionManagerService } from '@src/common/infrastructure/transaction/transaction.service';

export const VendorProvider: Provider[] = [
  ...VendorHandlersProviders,
  ...VendorMapperProviders,
  {
    provide: LOCALIZATION_SERVICE,
    useClass: LocalizationService,
  },
  {
    provide: TRANSACTION_MANAGER_SERVICE,
    useClass: TransactionManagerService,
  },
  {
    provide: VENDOR_APPLICATION_SERVICE,
    useClass: VendorService,
  },
  {
    provide: WRITE_VENDOR_REPOSITORY,
    useClass: WriteVendorRepository,
  },
  {
    provide: READ_VENDOR_REPOSITORY,
    useClass: ReadVendorRepository,
  },
  // {
  //   provide: TRANSFORM_RESULT_SERVICE,
  //   useClass: TransformResultService,
  // },
];
