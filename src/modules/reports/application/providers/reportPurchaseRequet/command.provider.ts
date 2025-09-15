import { Provider } from '@nestjs/common';
import { GetReportQueryHandler } from '../../queries/reportPurchaseRequest/handler/report-command.query';

export const ReportPurchaseRequestHandlersProviders: Provider[] = [
  GetReportQueryHandler,
];
