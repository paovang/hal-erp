import { Provider } from '@nestjs/common';
import { ReportPurchaseRequestHandlersProviders } from './command.provider';
import { ReportPurchaseRequestMapperProviders } from './mapper.provider';
import {
  LOCALIZATION_SERVICE,
  TRANSACTION_MANAGER_SERVICE,
  TRANSFORM_RESULT_SERVICE,
} from '@src/common/constants/inject-key.const';
import { LocalizationService } from '@src/common/infrastructure/localization/localization.service';
import { TransactionManagerService } from '@src/common/infrastructure/transaction/transaction.service';
import {
  REPORT_PURCHASE_REQUEST_APPLICATION_SERVICE,
  REPORT_PURCHASE_REQUEST_REPOSITORY,
} from '../../constants/inject-key.const';
import { ReportPurchaseRequestService } from '../../services/report-purchase-request.service';
import { ReportReadPurchaseRequestRepository } from '@src/modules/reports/infrastructure/repositories/reportPurchaseRequest/read.repository';
import { TransformResultService } from '@src/common/utils/services/transform-result.service';

export const ReportPurchaseRequestProvider: Provider[] = [
  ...ReportPurchaseRequestHandlersProviders,
  ...ReportPurchaseRequestMapperProviders,
  {
    provide: LOCALIZATION_SERVICE,
    useClass: LocalizationService,
  },
  {
    provide: TRANSACTION_MANAGER_SERVICE,
    useClass: TransactionManagerService,
  },
  {
    provide: REPORT_PURCHASE_REQUEST_APPLICATION_SERVICE,
    useClass: ReportPurchaseRequestService,
  },
  {
    provide: REPORT_PURCHASE_REQUEST_REPOSITORY,
    useClass: ReportReadPurchaseRequestRepository,
  },
  {
    provide: TRANSFORM_RESULT_SERVICE,
    useClass: TransformResultService,
  },
];
