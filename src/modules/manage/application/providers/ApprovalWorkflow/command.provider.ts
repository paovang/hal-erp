import { Provider } from '@nestjs/common';
import { CreateCommandHandler } from '../../commands/ApprovalWorkflow/handler/create-command.handler';
import { GetAllQueryHandler } from '../../queries/ApprovalWorkflow/handler/get-all.command.query';
import { GetOneQueryHandler } from '../../queries/ApprovalWorkflow/handler/get-one.command.query';
import { UpdateCommandHandler } from '../../commands/ApprovalWorkflow/handler/update-command.handler';
import { DeleteCommandHandler } from '../../commands/ApprovalWorkflow/handler/delete-command.handler';
import { ApproveCommandHandler } from '../../commands/ApprovalWorkflow/handler/approve-command.handler';
import { SendApprovalMailCommandHandler } from '../../commands/ApprovalWorkflow/handler/send-approval-mail-command.handler';
import { ApproveByTokenCommandHandler } from '../../commands/ApprovalWorkflow/handler/approve-by-token-command.handler';

export const ApprovalWorkflowHandlersProviders: Provider[] = [
  GetAllQueryHandler,
  GetOneQueryHandler,
  CreateCommandHandler,
  UpdateCommandHandler,
  DeleteCommandHandler,
  ApproveCommandHandler,
  SendApprovalMailCommandHandler,
  ApproveByTokenCommandHandler,
];
