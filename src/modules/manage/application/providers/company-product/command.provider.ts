import { Provider } from '@nestjs/common';
import { CreateCommandHandler } from '../../commands/company-product/handler/create-command.handler';
import { GetAllQueryHandler } from '../../queries/company-product/handler/get-all.command.query';
import { GetOneQueryHandler } from '../../queries/company-product/handler/get-one.command.query';
import { UpdateCommandHandler } from '../../commands/company-product/handler/update-command.handler';
import { DeleteCommandHandler } from '../../commands/company-product/handler/delete-command.handler';

export const CompanyProductHandlersProviders: Provider[] = [
  CreateCommandHandler,
  GetAllQueryHandler,
  GetOneQueryHandler,
  UpdateCommandHandler,
  DeleteCommandHandler,
];
