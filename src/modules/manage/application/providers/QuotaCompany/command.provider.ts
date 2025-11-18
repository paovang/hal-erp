import { Provider } from '@nestjs/common';
import { CreateCommandHandler } from '../../commands/QuotaCompany/handler/create-command.handler';
import { GetAllQueryHandler } from '../../queries/QuotaCompany/handler/get-all.command.query';
import { GetOneQueryHandler } from '../../queries/QuotaCompany/handler/get-one.command.query';
import { UpdateCommandHandler } from '../../commands/QuotaCompany/handler/update-command.handler';
import { DeleteCommandHandler } from '../../commands/QuotaCompany/handler/delete-command.handler';

export const QuotaCompanyHandlersProviders: Provider[] = [
  GetAllQueryHandler,
  GetOneQueryHandler,
  CreateCommandHandler,
  UpdateCommandHandler,
  DeleteCommandHandler,
];
