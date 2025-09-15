import { Provider } from '@nestjs/common';
import { ReportPurchaseRequestDataAccessMapper } from '@src/modules/reports/infrastructure/mappers/report-purchase-request.mapper';
import { ReportPurchaseRequestDataMapper } from '../../mappers/report-purchase-request.mpper';
import { ReportPurchaseRequestItemDataMapper } from '../../mappers/report-purchase-request-item.mapper';
import { ReportPurchaseRequestItemDataAccessMapper } from '@src/modules/reports/infrastructure/mappers/report-purchase-request-item.mapper';

export const ReportPurchaseRequestMapperProviders: Provider[] = [
  ReportPurchaseRequestDataAccessMapper,
  ReportPurchaseRequestDataMapper,
  ReportPurchaseRequestItemDataMapper,
  ReportPurchaseRequestItemDataAccessMapper,
];
