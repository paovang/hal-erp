import { Provider } from '@nestjs/common';
import { CreateCommandHandler } from '../../commands/Document/handler/create.command.handler';
import { GetAllQueryHandler } from '../../queries/Document/handler/get-all.command.query';
import { GetOneQueryHandler } from '../../queries/Document/handler/get-one.command.query';
import { UpdateCommandHandler } from '../../commands/Document/handler/udpate.command.handler';
import { DeleteCommandHandler } from '../../commands/Document/handler/delete.command.handler';

export const DocumentHandlersProviders: Provider[] = [
  GetAllQueryHandler,
  GetOneQueryHandler,
  CreateCommandHandler,
  UpdateCommandHandler,
  DeleteCommandHandler,
];
