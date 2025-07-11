import { Provider } from '@nestjs/common';
import { GetAllQueryHandler } from '../../queries/purchaseOrder/handler/get-all.command.query';
import { GetOneQueryHandler } from '../../queries/purchaseOrder/handler/get-one.command.query';
import { CreateCommandHandler } from '../../commands/purchaseOrder/handler/create.command.handler';
import { UpdateCommandHandler } from '../../commands/purchaseOrder/handler/update.command.handler';
import { UpdateBudgetItemDetailCommandHandler } from '../../commands/purchaseOrder/handler/update-budget-item-detail.command.handler';
import { DeleteCommandHandler } from '../../commands/purchaseOrder/handler/delete.command.handler';

export const PurchaseOrderHandlersProviders: Provider[] = [
  GetAllQueryHandler,
  GetOneQueryHandler,
  CreateCommandHandler,
  UpdateCommandHandler,
  UpdateBudgetItemDetailCommandHandler,
  DeleteCommandHandler,
];
