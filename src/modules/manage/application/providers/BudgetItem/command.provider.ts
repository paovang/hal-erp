import { Provider } from '@nestjs/common';
import { CreateCommandHandler } from '../../commands/BudgetItem/handler/create-command.handler';
import { GetAllQueryHandler } from '../../queries/BudgetItem/handler/get-all.command.query';
import { GetOneQueryHandler } from '../../queries/BudgetItem/handler/get-one.command.query';
import { UpdateCommandHandler } from '../../commands/BudgetItem/handler/update-command.handler';
import { DeleteCommandHandler } from '../../commands/BudgetItem/handler/delete-command.handler';
import { GetReportQueryHandler } from '../../queries/BudgetItem/handler/report.command.query';
import { GetItemIdQueryHandler } from '../../queries/BudgetItem/handler/get-item-id.command.query';

export const BudgetItemHandlersProviders: Provider[] = [
  GetAllQueryHandler,
  GetOneQueryHandler,
  CreateCommandHandler,
  UpdateCommandHandler,
  DeleteCommandHandler,
  GetReportQueryHandler,
  GetItemIdQueryHandler,
];
