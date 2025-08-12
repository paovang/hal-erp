import { Provider } from '@nestjs/common';
// import { ApproveCommandHandler } from '../../commands/userApprovalStep/handler/approve.command.handler';
import { ApproveStepCommandHandler } from '../../commands/userApprovalStep/handler/approve-step.command.handler';
import { SendOTPCommandHandler } from '../../commands/userApprovalStep/handler/send-otp.command.handler';

export const UserApprovalStepHandlersProviders: Provider[] = [
  // ApproveCommandHandler,
  ApproveStepCommandHandler,
  SendOTPCommandHandler,
];
