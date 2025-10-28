import { Provider } from '@nestjs/common';
import { CreateCommandHandler } from '../../commands/product-type/handler/create-command.handler';
import { GetAllQueryHandler } from '../../queries/product-type/handler/get-all.command.query';
import { GetOneQueryHandler } from '../../queries/product-type/handler/get-one.command.query';
import { UpdateCommandHandler } from '../../commands/product-type/handler/update-command.handler';
import { DeleteCommandHandler } from '../../commands/product-type/handler/delete-command.handler';

export const ProductTypeHandlersProviders: Provider[] = [
  GetAllQueryHandler,
  GetOneQueryHandler,
  CreateCommandHandler,
  UpdateCommandHandler,
  DeleteCommandHandler,
];
