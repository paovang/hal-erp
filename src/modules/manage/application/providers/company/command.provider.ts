import { DeleteCommandHandler } from '@src/modules/manage/application/commands/company/handler/delete-command.handler';
import { UpdateCommandHandler } from '@src/modules/manage/application/commands/company/handler/update-command.handler';
import { Provider } from '@nestjs/common';
import { GetAllQueryHandler } from '@src/modules/manage/application/queries/company/handler/get-all.command.query';
import { CreateCommandHandler } from '@src/modules/manage/application/commands/company/handler/create-command.handler';
import { GetOneQueryHandler } from '@src/modules/manage/application/queries/company/handler/get-one.command.query';
import { GetReportQueryHandler } from '../../queries/company/handler/get-report-query.handler';
import { GetOneReportQueryHandler } from '../../queries/company/handler/get-one-report.command.query';

export const CompanyHandlersProviders: Provider[] = [
  GetAllQueryHandler,
  GetOneQueryHandler,
  GetOneReportQueryHandler,
  CreateCommandHandler,
  UpdateCommandHandler,
  DeleteCommandHandler,
  GetReportQueryHandler,
];
