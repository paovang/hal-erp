import { Provider } from '@nestjs/common';
// import { ApproveCommandHandler } from '../../commands/userApprovalStep/handler/approve.command.handler';
import { ApproveStepCommandHandler } from '../../commands/userApprovalStep/handler/approve-step.command.handler';

export const UserApprovalStepHandlersProviders: Provider[] = [
  // ApproveCommandHandler,
  ApproveStepCommandHandler,
];
