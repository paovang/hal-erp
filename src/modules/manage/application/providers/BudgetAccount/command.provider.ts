import { Provider } from '@nestjs/common';
import { CreateCommandHandler } from '../../commands/BudgetAccount/handler/create-command.handler';
import { GetAllQueryHandler } from '../../queries/BudgetAccount/handler/get-all.command.query';
import { GetOneQueryHandler } from '../../queries/BudgetAccount/handler/get-one.command.query';
import { UpdateCommandHandler } from '../../commands/BudgetAccount/handler/update-commmand.handler';
import { DeleteCommandHandler } from '../../commands/BudgetAccount/handler/delete-command.handler';
import { GetReportQueryHandler } from '../../queries/BudgetAccount/handler/report.command.query';

export const BudgetAccountHandlersProviders: Provider[] = [
  GetAllQueryHandler,
  GetOneQueryHandler,
  CreateCommandHandler,
  UpdateCommandHandler,
  DeleteCommandHandler,
  GetReportQueryHandler,
];
