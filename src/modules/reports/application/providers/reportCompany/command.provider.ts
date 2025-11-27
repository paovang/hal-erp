import { Provider } from '@nestjs/common';
import { GetReportCompanyQueryHandler } from '../../queries/reportCompany/handlers/report-company.query.handler';

export const ReportHandlersProviders: Provider[] = [
  GetReportCompanyQueryHandler,
];
