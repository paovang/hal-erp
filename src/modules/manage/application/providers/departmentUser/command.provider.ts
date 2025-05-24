import { Provider } from '@nestjs/common';
import { CreateCommandHandler } from '../../commands/departmentUser/handler/create-command.handler';
import { GetAllQueryHandler } from '../../queries/departmentUser/handler/get-all.command.query';
import { UpdateCommandHandler } from '../../commands/departmentUser/handler/update-command.handler';
import { DeleteCommandHandler } from '../../commands/departmentUser/handler/delete-command.handler';

export const DepartmentUserHandlersProviders: Provider[] = [
  CreateCommandHandler,
  GetAllQueryHandler,
  UpdateCommandHandler,
  DeleteCommandHandler,
];
