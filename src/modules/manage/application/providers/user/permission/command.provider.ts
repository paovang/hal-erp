import { Provider } from '@nestjs/common';
import { GetAllQueryHandler } from '../../../queries/user/permission/handler/get-all.command.query';
import { GetOneQueryHandler } from '../../../queries/user/permission/handler/get-one.command.query';

export const PermissionHandlersProviders: Provider[] = [
  GetAllQueryHandler,
  GetOneQueryHandler,
];
