import { Provider } from '@nestjs/common';
import { CreateCommandHandler } from '../../commands/BudgetItemDetail/handler/create.command.handler';
import { GetAllQueryHandler } from '../../queries/BudgetItemDetail/handler/get-all.command.query';
import { GetOneQueryHandler } from '../../queries/BudgetItemDetail/handler/get-one.command.query';
import { DeleteCommandHandler } from '../../commands/BudgetItemDetail/handler/delete.command.handler';
import { UpdateBudgetItemDetailCommandHandler } from '../../commands/BudgetItemDetail/handler/update.command.handler';

export const BudgetItemDetailHandlersProviders: Provider[] = [
  GetAllQueryHandler,
  GetOneQueryHandler,
  CreateCommandHandler,
  UpdateBudgetItemDetailCommandHandler,
  DeleteCommandHandler,
];
