import { Provider } from '@nestjs/common';
import { CreateCommandHandler } from '../../commands/currency/handler/create-command.handler';
import { GetAllQueryHandler } from '../../queries/currency/handler/get-all.command.query';
import { GetOneQueryHandler } from '../../queries/currency/handler/get-one.command.query';
import { UpdateCommandHandler } from '../../commands/currency/handler/update-command.handler';
import { DeleteCommandHandler } from '../../commands/currency/handler/delete-command.handler';

export const CurrencyHandlersProviders: Provider[] = [
  CreateCommandHandler,
  GetAllQueryHandler,
  GetOneQueryHandler,
  UpdateCommandHandler,
  DeleteCommandHandler,
];
