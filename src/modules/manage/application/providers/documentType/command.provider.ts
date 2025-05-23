import { Provider } from '@nestjs/common';
import { CreateCommandHandler } from '../../commands/documentType/handler/create-command.handler';
import { GetAllQueryHandler } from '../../queries/documentType/handler/get-all.command.query';
import { GetOneQueryHandler } from '../../queries/documentType/handler/get-one.command.query';
import { UpdateCommandHandler } from '../../commands/documentType/handler/update-command.handler';
import { DeleteCommandHandler } from '../../commands/documentType/handler/delete-command.handler';

export const DocumentTypeHandlersProviders: Provider[] = [
  GetAllQueryHandler,
  GetOneQueryHandler,
  CreateCommandHandler,
  UpdateCommandHandler,
  DeleteCommandHandler,
];
