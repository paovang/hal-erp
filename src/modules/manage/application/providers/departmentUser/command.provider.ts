import { Provider } from '@nestjs/common';
import { CreateCommandHandler } from '../../commands/departmentUser/handler/create-command.handler';
import { GetAllQueryHandler } from '../../queries/departmentUser/handler/get-all.command.query';
import { UpdateCommandHandler } from '../../commands/departmentUser/handler/update-command.handler';
import { DeleteCommandHandler } from '../../commands/departmentUser/handler/delete-command.handler';
import { GetOneQueryHandler } from '../../queries/departmentUser/handler/get-one.command.query';
import { GetAllByDepartmentQueryHandler } from '../../queries/departmentUser/handler/get-all-by-department.command.query';

export const DepartmentUserHandlersProviders: Provider[] = [
  CreateCommandHandler,
  GetAllQueryHandler,
  GetOneQueryHandler,
  GetAllByDepartmentQueryHandler,
  UpdateCommandHandler,
  DeleteCommandHandler,
];
