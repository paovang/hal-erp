import { Provider } from '@nestjs/common';
import { CreateCommandHandler } from '../../commands/increaseBudgetDetail/handler/create.command.handler';
import { GetAllQueryHandler } from '../../queries/increaseBudgetDetail/handler/get-all.command.query';
import { UpdateCommandHandler } from '../../commands/increaseBudgetDetail/handler/update.command.handler';
import { GetOneQueryHandler } from '../../queries/increaseBudgetDetail/handler/get-one.command.query';
import { DeleteCommandHandler } from '../../commands/increaseBudgetDetail/handler/delete.command.handler';

export const IncreaseBudgetDetailHandlersProviders: Provider[] = [
  CreateCommandHandler,
  GetAllQueryHandler,
  GetOneQueryHandler,
  UpdateCommandHandler,
  DeleteCommandHandler,
];
