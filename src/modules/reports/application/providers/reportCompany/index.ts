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
  REPORT_PURCHASE_ORDER_APPLICATION_SERVICE,
  REPORT_PURCHASE_ORDER_REPOSITORY,
} from '../../constants/inject-key.const';
import { ReportReceiptService } from '../../services/report-receipt.service';
import { ReportReadReceiptRepository } from '@src/modules/reports/infrastructure/repositories/reportReceipt/read.repository';
import { TransformResultService } from '@src/common/utils/services/transform-result.service';

export const ReportCompanyProvider: Provider[] = [
  ...ReportHandlersProviders,
  ...ReportMapperProviders,
  {
    provide: LOCALIZATION_SERVICE,
    useClass: LocalizationService,
  },
  {
    provide: REPORT_PURCHASE_ORDER_APPLICATION_SERVICE,
    useClass: ReportReceiptService,
  },
  {
    provide: REPORT_COMPANY_REPOSITORY,
    useClass: ReportReadReceiptRepository,
  },
  {
    provide: TRANSFORM_RESULT_SERVICE,
    useClass: TransformResultService,
  },
];
