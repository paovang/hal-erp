import { Provider } from '@nestjs/common';
import { CreateCommandHandler } from '../../commands/approvalWorkflowStep/handler/create.command.handler';

export const ApprovalWorkflowStepHandlersProviders: Provider[] = [
  // GetAllQueryHandler,
  // GetOneQueryHandler,
  CreateCommandHandler,
  // UpdateCommandHandler,
  // DeleteCommandHandler,
];
