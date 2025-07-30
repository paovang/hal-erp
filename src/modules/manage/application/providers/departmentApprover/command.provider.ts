import { Provider } from '@nestjs/common';
import { CreateCommandHandler } from '../../commands/departmentApprover/handler/create-command.handler';
import { GetAllQueryHandler } from '../../queries/departmentApprover/handler/get-all.command.query';
import { GetOneQueryHandler } from '../../queries/departmentApprover/handler/get-one.command.query';
import { UpdateCommandHandler } from '../../commands/departmentApprover/handler/update-command.handler';
import { DeleteCommandHandler } from '../../commands/departmentApprover/handler/delete-command.handler';
import { CreateByUserCommandHandler } from '../../commands/departmentApprover/handler/create-by-user.command.handler';
import { UpdateByUserCommandHandler } from '../../commands/departmentApprover/handler/update-by-user.command.handler';

export const DepartmentApproverHandlersProviders: Provider[] = [
  CreateCommandHandler,
  CreateByUserCommandHandler,
  GetAllQueryHandler,
  GetOneQueryHandler,
  UpdateCommandHandler,
  UpdateByUserCommandHandler,
  DeleteCommandHandler,
];
