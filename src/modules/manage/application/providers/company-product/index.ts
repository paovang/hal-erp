import { Provider } from '@nestjs/common';
import {
  LOCALIZATION_SERVICE,
  TRANSACTION_MANAGER_SERVICE,
} from '@src/common/constants/inject-key.const';
import { CompanyProductHandlersProviders } from './command.provider';
import { CompanyProductMapperProviders } from './mapper.provider';
import {
  READ_COMPANY_PRODUCT_REPOSITORY,
  COMPANY_PRODUCT_APPLICATION_SERVICE,
  WRITE_COMPANY_PRODUCT_REPOSITORY,
} from '../../constants/inject-key.const';
import { CompanyProductService } from '../../services/company-product.service';
import { WriteCompanyProductRepository } from '@src/modules/manage/infrastructure/repositories/company-product/write.repository';
import { ReadCompanyProductRepository } from '@src/modules/manage/infrastructure/repositories/company-product/read.repository';
import { LocalizationService } from '@src/common/infrastructure/localization/localization.service';
import { TransactionManagerService } from '@src/common/infrastructure/transaction/transaction.service';

export const CompanyProductProvider: Provider[] = [
  ...CompanyProductHandlersProviders,
  ...CompanyProductMapperProviders,
  {
    provide: LOCALIZATION_SERVICE,
    useClass: LocalizationService,
  },
  {
    provide: TRANSACTION_MANAGER_SERVICE,
    useClass: TransactionManagerService,
  },
  {
    provide: COMPANY_PRODUCT_APPLICATION_SERVICE,
    useClass: CompanyProductService,
  },
  {
    provide: WRITE_COMPANY_PRODUCT_REPOSITORY,
    useClass: WriteCompanyProductRepository,
  },
  {
    provide: READ_COMPANY_PRODUCT_REPOSITORY,
    useClass: ReadCompanyProductRepository,
  },
];
