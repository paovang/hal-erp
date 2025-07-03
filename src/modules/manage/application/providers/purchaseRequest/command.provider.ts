import { Provider } from '@nestjs/common';
import { GetAllQueryHandler } from '../../queries/purchaseRequest/handler/get-all.command.query';
import { GetOneQueryHandler } from '../../queries/purchaseRequest/handler/get-one.command.query';
import { CreateCommandHandler } from '../../commands/purchaseRequest/handler/create.command.handler';
import { UpdateCommandHandler } from '../../commands/purchaseRequest/handler/update.command.handler';
import { DeleteCommandHandler } from '../../commands/purchaseRequest/handler/delete.command.handler';

export const PurchaseRequestHandlersProviders: Provider[] = [
  GetAllQueryHandler,
  GetOneQueryHandler,
  CreateCommandHandler,
  UpdateCommandHandler,
  DeleteCommandHandler,
];
