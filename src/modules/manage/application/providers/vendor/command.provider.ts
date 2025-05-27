import { Provider } from '@nestjs/common';
import { CreateCommandHandler } from '../../commands/vendor/handler/create-command.handler';
import { GetAllQueryHandler } from '../../queries/vendor/handler/get-all.command.query';
import { GetOneQueryHandler } from '../../queries/vendor/handler/get-one.command.query';
import { UpdateCommandHandler } from '../../commands/vendor/handler/update-command.handler';
import { DeleteCommandHandler } from '../../commands/vendor/handler/delete-command.handler';

export const VendorHandlersProviders: Provider[] = [
  CreateCommandHandler,
  GetAllQueryHandler,
  GetOneQueryHandler,
  UpdateCommandHandler,
  DeleteCommandHandler,
];
