import { Provider } from '@nestjs/common';
import { GetReportQueryHandler } from '../../queries/reportPurchaseOrder/handler/report-command.query';
import { GetReportMoneyQueryHandler } from '../../queries/reportPurchaseOrder/handler/report-money-query.handler';
import { GetReportMoneyByPaginationQueryHandler } from '../../queries/reportPurchaseOrder/handler/report-money-paginate-query';

export const ReportPurchaseOrderHandlersProviders: Provider[] = [
  GetReportQueryHandler,
  GetReportMoneyQueryHandler,
  GetReportMoneyByPaginationQueryHandler,
];
