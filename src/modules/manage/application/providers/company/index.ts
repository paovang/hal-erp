import { CompanyService } from '@src/modules/manage/application/services/company.service';
import {
  COMPANY_APPLICATION_SERVICE,
  READ_COMPANY_REPOSITORY,
  WRITE_COMPANY_REPOSITORY,
} from '@src/modules/manage/application/constants/inject-key.const';
import { Provider } from '@nestjs/common';
import { ReadCompanyRepository } from '@src/modules/manage/infrastructure/repositories/company/read.repository';
import {
  LOCALIZATION_SERVICE,
  TRANSACTION_MANAGER_SERVICE,
} from '@src/common/constants/inject-key.const';
import { WriteCompanyRepository } from '@src/modules/manage/infrastructure/repositories/company/write.repository';
import { CompanyMapperProviders } from '@src/modules/manage/application/providers/company/mapper.provider';
import { CompanyHandlersProviders } from '@src/modules/manage/application/providers/company/command.provider';
import { TransactionManagerService } from '@src/common/infrastructure/transaction/transaction.service';
import { LocalizationService } from '@src/common/infrastructure/localization/localization.service';

export const CompanyProvider: Provider[] = [
  ...CompanyHandlersProviders,
  ...CompanyMapperProviders,
  {
    provide: LOCALIZATION_SERVICE,
    useClass: LocalizationService,
  },
  {
    provide: TRANSACTION_MANAGER_SERVICE,
    useClass: TransactionManagerService,
  },
  {
    provide: COMPANY_APPLICATION_SERVICE,
    useClass: CompanyService,
  },
  {
    provide: WRITE_COMPANY_REPOSITORY,
    useClass: WriteCompanyRepository,
  },
  {
    provide: READ_COMPANY_REPOSITORY,
    useClass: ReadCompanyRepository,
  },
];
