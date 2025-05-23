import { Provider } from '@nestjs/common';
import { CreateCommandHandler } from '../../commands/category/handler/create-command.handler';
import { GetAllQueryHandler } from '../../queries/category/handler/get-all.command.query';
import { GetOneQueryHandler } from '../../queries/category/handler/get-one.command.query';
import { UpdateCommandHandler } from '../../commands/category/handler/update-command.handler';
import { DeleteCommandHandler } from '../../commands/category/handler/delete-command.handler';

export const CategoryHandlersProviders: Provider[] = [
  GetAllQueryHandler,
  GetOneQueryHandler,
  CreateCommandHandler,
  UpdateCommandHandler,
  DeleteCommandHandler,
];
