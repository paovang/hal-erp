import { Provider } from '@nestjs/common';
import { GetReportQueryHandler } from '../../queries/reportPurchaseRequest/handler/report-command.query';
import { GetReportMoneyQueryHandler } from '../../queries/reportPurchaseRequest/handler/report-money-query.handler';
import { GetProcurementStatisticsQueryHandler } from '../../queries/procurement-statistics/handler/procurement-statistics-query.handler';

export const ReportPurchaseRequestHandlersProviders: Provider[] = [
  GetReportQueryHandler,
  GetReportMoneyQueryHandler,
  GetProcurementStatisticsQueryHandler,
];
