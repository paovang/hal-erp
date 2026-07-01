import { Provider } from '@nestjs/common';
import { CreateCommandHandler } from '../../commands/company-vendor/handler/create-command.handler';
import { GetAllQueryHandler } from '../../queries/company-vendor/handler/get-all.command.query';
import { GetOneQueryHandler } from '../../queries/company-vendor/handler/get-one.command.query';
import { UpdateCommandHandler } from '../../commands/company-vendor/handler/update-command.handler';
import { DeleteCommandHandler } from '../../commands/company-vendor/handler/delete-command.handler';

export const CompanyVendorHandlersProviders: Provider[] = [
  CreateCommandHandler,
  GetAllQueryHandler,
  GetOneQueryHandler,
  UpdateCommandHandler,
  DeleteCommandHandler,
];
