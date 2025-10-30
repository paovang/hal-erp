import { Provider } from '@nestjs/common';
import { HandlersProviders } from './command.provider';
import { MapperProviders } from './mapper.provider';
import {
  LOCALIZATION_SERVICE,
  TRANSACTION_MANAGER_SERVICE,
} from '@src/common/constants/inject-key.const';
import { LocalizationService } from '@src/common/infrastructure/localization/localization.service';
import { TransactionManagerService } from '@src/common/infrastructure/transaction/transaction.service';
import {
  COMPANY_USER_APPLICATION_SERVICE,
  READ_COMPANY_USER_REPOSITORY,
  WRITE_COMPANY_USER_REPOSITORY,
} from '../../constants/inject-key.const';
import { CompanyUserService } from '../../services/company-user.service';
import { WriteCompanyUserRepository } from '@src/modules/manage/infrastructure/repositories/CompnayUser/write.repository';
import { ReadCompanyUserRepository } from '@src/modules/manage/infrastructure/repositories/CompnayUser/read.repository';

export const CompanyUserProvider: Provider[] = [
  ...HandlersProviders,
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
    provide: COMPANY_USER_APPLICATION_SERVICE,
    useClass: CompanyUserService,
  },
  {
    provide: WRITE_COMPANY_USER_REPOSITORY,
    useClass: WriteCompanyUserRepository,
  },
  {
    provide: READ_COMPANY_USER_REPOSITORY,
    useClass: ReadCompanyUserRepository,
  },
];
