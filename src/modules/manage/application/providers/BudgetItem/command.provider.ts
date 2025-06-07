import { Provider } from '@nestjs/common';
import { CreateCommandHandler } from '../../commands/BudgetItem/handler/create-command.handler';
import { GetAllQueryHandler } from '../../queries/BudgetItem/handler/get-all.command.query';

export const BudgetItemHandlersProviders: Provider[] = [
  GetAllQueryHandler,
  //   GetOneQueryHandler,
  CreateCommandHandler,
  //   UpdateCommandHandler,
  //   DeleteCommandHandler,
];
