import { Provider } from '@nestjs/common';
import { GetAllQueryHandler } from '../../../queries/user/role/handler/get-all.command.query';
import { GetOneQueryHandler } from '../../../queries/user/role/handler/get-one.command.query';
import { CreateCommandHandler } from '../../../commands/role/handler/create.command.handler';
import { UpdateCommandHandler } from '../../../commands/role/handler/update.command.handler';
import { DeleteCommandHandler } from '../../../commands/role/handler/delete.command.handler';
import { CreateRoleCommandHandler } from '../../../commands/role/handler/create-role-command.handler';
import { UpdateRoleCommandHandler } from '../../../commands/role/handler/update-role-command.handler';
import { GetAllForCompanyQueryHandler } from '../../../queries/user/role/handler/get-all-for-company-query.handler';
import { GetAllForCompanyUserQueryHandler } from '../../../queries/user/role/handler/get-all-for-company-user-query.handler';

export const RoleHandlersProviders: Provider[] = [
  GetAllQueryHandler,
  GetOneQueryHandler,
  CreateCommandHandler,
  UpdateCommandHandler,
  DeleteCommandHandler,
  CreateRoleCommandHandler,
  UpdateRoleCommandHandler,
  GetAllForCompanyQueryHandler,
  GetAllForCompanyUserQueryHandler,
];
