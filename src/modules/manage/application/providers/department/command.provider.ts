import { DeleteCommandHandler } from '@src/modules/manage/application/commands/department/handler/delete-command.handler';
import { UpdateCommandHandler } from '@src/modules/manage/application/commands/department/handler/update.command.handler';
import { Provider } from '@nestjs/common';
import { GetAllQueryHandler } from '@src/modules/manage/application/queries/department/handler/get-all.command.query';
import { CreateCommandHandler } from '@src/modules/manage/application/commands/department/handler/create-command.handler';
import { GetOneQueryHandler } from '@src/modules/manage/application/queries/department/handler/get-one.command.query';
import { GetReportQueryHandler } from '../../queries/department/handler/get-report.command.query';

export const DepartmentHandlersProviders: Provider[] = [
  GetAllQueryHandler,
  GetOneQueryHandler,
  CreateCommandHandler,
  UpdateCommandHandler,
  DeleteCommandHandler,
  GetReportQueryHandler,
];
