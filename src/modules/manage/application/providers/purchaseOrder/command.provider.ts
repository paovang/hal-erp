import { Provider } from '@nestjs/common';
import { GetAllQueryHandler } from '../../queries/purchaseOrder/handler/get-all.command.query';
import { GetOneQueryHandler } from '../../queries/purchaseOrder/handler/get-one.command.query';
import { CreateCommandHandler } from '../../commands/purchaseOrder/handler/create.command.handler';

export const PurchaseOrderHandlersProviders: Provider[] = [
  GetAllQueryHandler,
  GetOneQueryHandler,
  CreateCommandHandler,
];
