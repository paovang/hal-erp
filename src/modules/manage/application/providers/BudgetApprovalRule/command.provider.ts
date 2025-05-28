import { Provider } from '@nestjs/common';
import { CreateCommandHandler } from '../../commands/BudgetApprovalRule/handler/create-command.handler';
import { GetAllQueryHandler } from '../../queries/BudgetApprovalRule/handler/get-all.command.query';
import { GetOneQueryHandler } from '../../queries/BudgetApprovalRule/handler/get-one.command.query';
import { UpdateCommandHandler } from '../../commands/BudgetApprovalRule/handler/update.command.handler';
import { DeleteCommandHandler } from '../../commands/BudgetApprovalRule/handler/delete-command.handler';

export const BudgetApprovalRuleHandlersProviders: Provider[] = [
  GetAllQueryHandler,
  GetOneQueryHandler,
  CreateCommandHandler,
  UpdateCommandHandler,
  DeleteCommandHandler,
];
