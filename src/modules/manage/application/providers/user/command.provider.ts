import { Provider } from '@nestjs/common';
import { CreateCommandHandler } from '../../commands/user/handler/create-command.handler';
import { GetAllQueryHandler } from '../../queries/user/handler/get-all.command.query';
import { GetOneQueryHandler } from '../../queries/user/handler/get-one.command.query';
import { UpdateCommandHandler } from '../../commands/user/handler/update-command.handler';
import { DeleteCommandHandler } from '../../commands/user/handler/delete-command.handler';
import { ChangePasswordCommandHandler } from '../../commands/user/handler/change-password-command.handler';

export const UserHandlersProviders: Provider[] = [
  CreateCommandHandler,
  GetAllQueryHandler,
  GetOneQueryHandler,
  UpdateCommandHandler,
  DeleteCommandHandler,
  ChangePasswordCommandHandler,
];
