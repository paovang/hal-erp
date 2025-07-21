import { Provider } from '@nestjs/common';
import { CreateCommandHandler } from '../../commands/receipt/handler/create.command.handler';
import { GetAllQueryHandler } from '../../queries/receipt/handler/get-all.command.query';
import { GetOneQueryHandler } from '../../queries/receipt/handler/get-one.command.query';
import { UpdateCommandHandler } from '../../commands/receipt/handler/update.command.handler';
import { DeleteCommandHandler } from '../../commands/receipt/handler/delete.command.handler';

export const ReceiptHandlersProviders: Provider[] = [
  CreateCommandHandler,
  GetAllQueryHandler,
  GetOneQueryHandler,
  UpdateCommandHandler,
  DeleteCommandHandler,
];
