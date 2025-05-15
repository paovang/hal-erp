import { UpdateCommandHandler } from '@src/modules/manage/application/commands/department/handler/update.command.handler';
import { Provider } from '@nestjs/common';
import { GetAllQueryHandler } from '@src/modules/manage/application/queries/department/handler/get-all.command.query';
import { CreateCommandHandler } from '@src/modules/manage/application/commands/department/handler/create-command.handler';

export const DepartmentHandlersProviders: Provider[] = [
  GetAllQueryHandler,
  CreateCommandHandler,
  UpdateCommandHandler,
];
