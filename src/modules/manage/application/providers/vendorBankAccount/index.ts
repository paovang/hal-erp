import { Provider } from '@nestjs/common';
import { VendorBankAccountHandlersProviders } from './command.provider';
import { VendorBankAccountMapperProviders } from './mapper.provider';
import { TransformResultService } from '@src/common/utils/services/transform-result.service';
import { TRANSFORM_RESULT_SERVICE } from '@src/common/constants/inject-key.const';
import { WriteVendorBankAccountRepository } from '@src/modules/manage/infrastructure/repositories/vendorBankAccount/write.repository';
import { VendorBankAccountService } from '../../services/vendor-bank-account.service';
import {
  READ_VENDOR_BANK_ACCOUNT_REPOSITORY,
  VENDOR_BANK_ACCOUNT_APPLICATION_SERVICE,
  WRITE_VENDOR_BANK_ACCOUNT_REPOSITORY,
} from '../../constants/inject-key.const';
import { ReadVendorBankAccountRepository } from '@src/modules/manage/infrastructure/repositories/vendorBankAccount/read.repository';

export const VendorBankAccountProvider: Provider[] = [
  ...VendorBankAccountHandlersProviders,
  ...VendorBankAccountMapperProviders,
  {
    provide: VENDOR_BANK_ACCOUNT_APPLICATION_SERVICE,
    useClass: VendorBankAccountService,
  },
  {
    provide: WRITE_VENDOR_BANK_ACCOUNT_REPOSITORY,
    useClass: WriteVendorBankAccountRepository,
  },
  {
    provide: READ_VENDOR_BANK_ACCOUNT_REPOSITORY,
    useClass: ReadVendorBankAccountRepository,
  },
  // {
  //   provide: TRANSFORM_RESULT_SERVICE,
  //   useClass: TransformResultService,
  // },
];
