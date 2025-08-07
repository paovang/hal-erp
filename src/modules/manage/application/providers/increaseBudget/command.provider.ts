import { Provider } from '@nestjs/common';
import { CreateCommandHandler } from '../../commands/increasebudget/handler/create.command.handler';
import { GetAllQueryHandler } from '../../queries/increaseBudget/handler/get-all.command.query';
import { GetOneQueryHandler } from '../../queries/increaseBudget/handler/get-one.command.query';

export const IncreaseBudgetHandlersProviders: Provider[] = [
  CreateCommandHandler,
  GetAllQueryHandler,
  GetOneQueryHandler,
  // UpdateCommandHandler,
  // DeleteCommandHandler,
];
