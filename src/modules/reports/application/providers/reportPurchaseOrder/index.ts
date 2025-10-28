import { Provider } from '@nestjs/common';
import { ReportPurchaseOrderHandlersProviders } from './command.provider';
import { ReportPurchaseOrderMapperProviders } from './mapper.provider';
import {
  LOCALIZATION_SERVICE,
  TRANSACTION_MANAGER_SERVICE,
  TRANSFORM_RESULT_SERVICE,
} from '@src/common/constants/inject-key.const';
import { LocalizationService } from '@src/common/infrastructure/localization/localization.service';
import { TransactionManagerService } from '@src/common/infrastructure/transaction/transaction.service';
import {
  REPORT_PURCHASE_ORDER_APPLICATION_SERVICE,
  REPORT_PURCHASE_ORDER_REPOSITORY,
} from '../../constants/inject-key.const';
import { ReportPurchaseOrderService } from '../../services/report-purchase-order.service';
import { ReportReadPurchaseOrderRepository } from '@src/modules/reports/infrastructure/repositories/reportPurchaseOrder/read.repository';
import { TransformResultService } from '@src/common/utils/services/transform-result.service';

export const ReportPurchaseOrderProvider: Provider[] = [
  ...ReportPurchaseOrderHandlersProviders,
  ...ReportPurchaseOrderMapperProviders,
  {
    provide: LOCALIZATION_SERVICE,
    useClass: LocalizationService,
  },
  {
    provide: TRANSACTION_MANAGER_SERVICE,
    useClass: TransactionManagerService,
  },
  {
    provide: REPORT_PURCHASE_ORDER_APPLICATION_SERVICE,
    useClass: ReportPurchaseOrderService,
  },
  {
    provide: REPORT_PURCHASE_ORDER_REPOSITORY,
    useClass: ReportReadPurchaseOrderRepository,
  },
  {
    provide: TRANSFORM_RESULT_SERVICE,
    useClass: TransformResultService,
  },
];
