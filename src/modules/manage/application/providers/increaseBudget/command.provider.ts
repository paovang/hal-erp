import { Provider } from '@nestjs/common';
import { CreateCommandHandler } from '../../commands/increasebudget/handler/create.command.handler';
import { GetAllQueryHandler } from '../../queries/increaseBudget/handler/get-all.command.query';
import { GetOneQueryHandler } from '../../queries/increaseBudget/handler/get-one.command.query';
import { UpdateCommandHandler } from '../../commands/increasebudget/handler/update.command.handler';
import { DeleteCommandHandler } from '../../commands/increasebudget/handler/delete.command.handler';

export const IncreaseBudgetHandlersProviders: Provider[] = [
  CreateCommandHandler,
  GetAllQueryHandler,
  GetOneQueryHandler,
  UpdateCommandHandler,
  DeleteCommandHandler,
];
