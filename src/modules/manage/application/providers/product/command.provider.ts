import { Provider } from '@nestjs/common';
import { CreateCommandHandler } from '../../commands/product/handler/create-command.handler';
import { GetAllQueryHandler } from '../../queries/product/handler/get-all.command.query';
import { GetOneQueryHandler } from '../../queries/product/handler/get-one.command.query';
import { UpdateCommandHandler } from '../../commands/product/handler/update-command.handler';
import { DeleteCommandHandler } from '../../commands/product/handler/delete-command.handler';

export const ProductHandlersProviders: Provider[] = [
  GetAllQueryHandler,
  GetOneQueryHandler,
  CreateCommandHandler,
  UpdateCommandHandler,
  DeleteCommandHandler,
];
