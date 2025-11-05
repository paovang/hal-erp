import { Provider } from '@nestjs/common';
import { CreateCommandHandler } from '../../commands/vendor-product/handler/create-command.handler';
import { GetAllQueryHandler } from '../../queries/vendor-product/handler/get-all.command.query';
import { GetOneQueryHandler } from '../../queries/vendor-product/handler/get-one.command.query';
import { UpdateCommandHandler } from '../../commands/vendor-product/handler/update-command.handler';
import { DeleteCommandHandler } from '../../commands/vendor-product/handler/delete-command.handler';

export const VendorProductHandlersProviders: Provider[] = [
  CreateCommandHandler,
  GetAllQueryHandler,
  GetOneQueryHandler,
  UpdateCommandHandler,
  DeleteCommandHandler,
];