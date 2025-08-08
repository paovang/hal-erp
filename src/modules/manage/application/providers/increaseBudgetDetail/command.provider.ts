import { Provider } from '@nestjs/common';
import { CreateCommandHandler } from '../../commands/increaseBudgetDetail/handler/create.command.handler';
import { GetAllQueryHandler } from '../../queries/increaseBudgetDetail/handler/get-all.command.query';

export const IncreaseBudgetDetailHandlersProviders: Provider[] = [
  CreateCommandHandler,
  GetAllQueryHandler,
  //   GetOneQueryHandler,
  //   UpdateCommandHandler,
  //   DeleteCommandHandler,
];
