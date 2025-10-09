import { Provider } from '@nestjs/common';
import { CreateExchangeRateCommandHandler } from '../../commands/exchange-rates/handler/create-command.handler';
import { GetAllExchangeRateQueryHandler } from '../../queries/exchange-rates/handler/get-all.command.query';
import { GetOneExchangeRateQueryHandler } from '../../queries/exchange-rates/handler/get-one.command.query';
import { UpdateExchangeRateCommandHandler } from '../../commands/exchange-rates/handler/update-command.handler';
import { DeleteExchangeRateCommandHandler } from '../../commands/exchange-rates/handler/delete-command.handler';

export const ExchangeRateHandlersProviders: Provider[] = [
  CreateExchangeRateCommandHandler,
  GetAllExchangeRateQueryHandler,
  GetOneExchangeRateQueryHandler,
  UpdateExchangeRateCommandHandler,
  DeleteExchangeRateCommandHandler,
];
