import { Provider } from '@nestjs/common';
import { GetAllQueryHandler } from '../../queries/documentCategory/handler/get-all.command.query';
export const DocumentCategoryHandlersProviders: Provider[] = [
  GetAllQueryHandler,
];
