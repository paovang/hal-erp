import { Provider } from '@nestjs/common';
import { ReportPurchaseRequestHandlersProviders } from './command.provider';
import { ReportPurchaseRequestMapperProviders } from './mapper.provider';
import {
  LOCALIZATION_SERVICE,
  TRANSACTION_MANAGER_SERVICE,
} from '@src/common/constants/inject-key.const';
import { LocalizationService } from '@src/common/infrastructure/localization/localization.service';
import { TransactionManagerService } from '@src/common/infrastructure/transaction/transaction.service';
import { REPORT_PURCHASE_REQUEST_APPLICATION_SERVICE } from '../../constants/inject-key.const';
import { ReportPurchaseRequestService } from '../../services/report-purchase-request.service';

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
  //   {
  //     provide: REPORT_PURCHASE_REQUEST_REPOSITORY,
  //     useClass: ReadPurchaseRequestRepository,
  //   },
];
