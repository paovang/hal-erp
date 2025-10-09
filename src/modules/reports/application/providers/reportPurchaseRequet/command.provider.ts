import { Provider } from '@nestjs/common';
import { GetReportQueryHandler } from '../../queries/reportPurchaseRequest/handler/report-command.query';
import { GetReportMoneyQueryHandler } from '../../queries/reportPurchaseRequest/handler/report-money-query.handler';

export const ReportPurchaseRequestHandlersProviders: Provider[] = [
  GetReportQueryHandler,
  GetReportMoneyQueryHandler,
];
