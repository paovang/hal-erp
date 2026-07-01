import { Provider } from '@nestjs/common';
import {
  LOCALIZATION_SERVICE,
  TRANSACTION_MANAGER_SERVICE,
} from '@src/common/constants/inject-key.const';
import { CompanyVendorHandlersProviders } from './command.provider';
import { CompanyVendorMapperProviders } from './mapper.provider';
import {
  READ_COMPANY_VENDOR_REPOSITORY,
  COMPANY_VENDOR_APPLICATION_SERVICE,
  WRITE_COMPANY_VENDOR_REPOSITORY,
} from '../../constants/inject-key.const';
import { CompanyVendorService } from '../../services/company-vendor.service';
import { WriteCompanyVendorRepository } from '@src/modules/manage/infrastructure/repositories/companyVendor/write.repository';
import { ReadCompanyVendorRepository } from '@src/modules/manage/infrastructure/repositories/companyVendor/read.repository';
import { LocalizationService } from '@src/common/infrastructure/localization/localization.service';
import { TransactionManagerService } from '@src/common/infrastructure/transaction/transaction.service';

export const CompanyVendorProvider: Provider[] = [
  ...CompanyVendorHandlersProviders,
  ...CompanyVendorMapperProviders,
  {
    provide: LOCALIZATION_SERVICE,
    useClass: LocalizationService,
  },
  {
    provide: TRANSACTION_MANAGER_SERVICE,
    useClass: TransactionManagerService,
  },
  {
    provide: COMPANY_VENDOR_APPLICATION_SERVICE,
    useClass: CompanyVendorService,
  },
  {
    provide: WRITE_COMPANY_VENDOR_REPOSITORY,
    useClass: WriteCompanyVendorRepository,
  },
  {
    provide: READ_COMPANY_VENDOR_REPOSITORY,
    useClass: ReadCompanyVendorRepository,
  },
];
