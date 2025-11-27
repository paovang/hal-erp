import { Provider } from '@nestjs/common';
import { ReportHandlersProviders } from './command.provider';
import { ReportMapperProviders } from './mapper.provider';
import {
  LOCALIZATION_SERVICE,
  TRANSFORM_RESULT_SERVICE,
} from '@src/common/constants/inject-key.const';
import { LocalizationService } from '@src/common/infrastructure/localization/localization.service';
import {
  REPORT_COMPANY_APPLICATION_SERVICE,
  REPORT_COMPANY_REPOSITORY,
} from '../../constants/inject-key.const';
import { ReportCompanyService } from '../../services/report-company-order.service';
import { ReportReadCompanyRepository } from '@src/modules/reports/infrastructure/repositories/reportCompany/read.repository';
import { TransformResultService } from '@src/common/utils/services/transform-result.service';

export const ReportCompanyProvider: Provider[] = [
  ...ReportHandlersProviders,
  ...ReportMapperProviders,
  {
    provide: LOCALIZATION_SERVICE,
    useClass: LocalizationService,
  },
  {
    provide: REPORT_COMPANY_APPLICATION_SERVICE,
    useClass: ReportCompanyService,
  },
  {
    provide: REPORT_COMPANY_REPOSITORY,
    useClass: ReportReadCompanyRepository,
  },
  {
    provide: TRANSFORM_RESULT_SERVICE,
    useClass: TransformResultService,
  },
];
// IReportCompanuRepository;
