import { Provider } from '@nestjs/common';
import { GetReportReceiptMoneyQueryHandler } from '../../queries/reportReceipt/handlers/report-money-query.handler';

export const ReportHandlersProviders: Provider[] = [
  GetReportReceiptMoneyQueryHandler,
];
