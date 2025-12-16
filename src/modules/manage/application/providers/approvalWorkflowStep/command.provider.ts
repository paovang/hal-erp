import { Provider } from '@nestjs/common';
import { CreateCommandHandler } from '../../commands/approvalWorkflowStep/handler/create.command.handler';
import { GetAllQueryHandler } from '../../queries/approvalWorkflowStep/handler/get-all.command.query';
import { GetOneQueryHandler } from '../../queries/approvalWorkflowStep/handler/get-one.command.query';
import { UpdateCommandHandler } from '../../commands/approvalWorkflowStep/handler/update.command.handler';
import { DeleteCommandHandler } from '../../commands/approvalWorkflowStep/handler/delete.command.handler';
import { OrderByCommandHandler } from '../../commands/approvalWorkflowStep/handler/order-by-command.handler';

export const ApprovalWorkflowStepHandlersProviders: Provider[] = [
  GetAllQueryHandler,
  GetOneQueryHandler,
  CreateCommandHandler,
  UpdateCommandHandler,
  DeleteCommandHandler,
  OrderByCommandHandler,
];
