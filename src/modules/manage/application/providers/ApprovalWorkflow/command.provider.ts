import { Provider } from '@nestjs/common';
import { CreateCommandHandler } from '../../commands/ApprovalWorkflow/handler/create-command.handler';
import { GetAllQueryHandler } from '../../queries/ApprovalWorkflow/handler/get-all.command.query';

export const ApprovalWorkflowHandlersProviders: Provider[] = [
  GetAllQueryHandler,
  //   GetOneQueryHandler,
  CreateCommandHandler,
  //   UpdateCommandHandler,
  //   DeleteCommandHandler,
];
