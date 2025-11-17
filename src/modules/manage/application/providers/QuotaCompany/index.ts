import { Provider } from '@nestjs/common';
import {
  LOCALIZATION_SERVICE,
  TRANSACTION_MANAGER_SERVICE,
} from '@src/common/constants/inject-key.const';
import { LocalizationService } from '@src/common/infrastructure/localization/localization.service';
import { TransactionManagerService } from '@src/common/infrastructure/transaction/transaction.service';
import {
  QUOTA_COMPANY_APPLICATION_SERVICE,
  READ_QUOTA_COMPANY_REPOSITORY,
  WRITE_QUOTA_COMPANY_REPOSITORY,
} from '../../constants/inject-key.const';
import { QuotaCompanyService } from '../../services/quota-company.service';
import { WriteQuotaRepository } from '@src/modules/manage/infrastructure/repositories/QuotaCompany/write.repository';
import { ReadQuotaCompanyRepository } from '@src/modules/manage/infrastructure/repositories/QuotaCompany/read.repository';
import { QuotaCompanyHandlersProviders } from './command.provider';
import { QuotaCompanyMapperProviders } from './mapper.provider';
export const QuotaCompanyProvider: Provider[] = [
  ...QuotaCompanyHandlersProviders,
  ...QuotaCompanyMapperProviders,
  {
    provide: LOCALIZATION_SERVICE,
    useClass: LocalizationService,
  },
  {
    provide: TRANSACTION_MANAGER_SERVICE,
    useClass: TransactionManagerService,
  },
  {
    provide: QUOTA_COMPANY_APPLICATION_SERVICE,
    useClass: QuotaCompanyService,
  },
  {
    provide: WRITE_QUOTA_COMPANY_REPOSITORY,
    useClass: WriteQuotaRepository,
  },
  {
    provide: READ_QUOTA_COMPANY_REPOSITORY,
    useClass: ReadQuotaCompanyRepository,
  },
];
