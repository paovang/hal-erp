import { Provider } from '@nestjs/common';
import { CreateCommandHandler } from '../../commands/Document/handler/create.command.handler';

export const DocumentHandlersProviders: Provider[] = [
  //   GetAllQueryHandler,
  //   GetOneQueryHandler,
  CreateCommandHandler,
  //   UpdateCommandHandler,
  //   DeleteCommandHandler,
];
