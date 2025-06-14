import { Provider } from '@nestjs/common';
import {
  APPROVAL_WORKFLOW_STEP_APPLICATION_SERVICE,
  READ_APPROVAL_WORKFLOW_STEP_REPOSITORY,
  WRITE_APPROVAL_WORKFLOW_STEP_REPOSITORY,
} from '../../constants/inject-key.const';
import { ApprovalWorkflowStepHandlersProviders } from './command.provider';
import { ApprovalWorkflowStepMapperProviders } from './mapper.provider';
import { WriteApprovalWorkflowStepRepository } from '@src/modules/manage/infrastructure/repositories/approvalWorkflowStep/write.repository';
import { ApprovalWorkflowStepService } from '../../services/approval-workflow-step.service';
import { ReadApprovalWorkflowStepRepository } from '@src/modules/manage/infrastructure/repositories/approvalWorkflowStep/read.repository';

export const ApprovalWorkflowStepProvider: Provider[] = [
  ...ApprovalWorkflowStepHandlersProviders,
  ...ApprovalWorkflowStepMapperProviders,
  {
    provide: APPROVAL_WORKFLOW_STEP_APPLICATION_SERVICE,
    useClass: ApprovalWorkflowStepService,
  },
  {
    provide: WRITE_APPROVAL_WORKFLOW_STEP_REPOSITORY,
    useClass: WriteApprovalWorkflowStepRepository,
  },
  {
    provide: READ_APPROVAL_WORKFLOW_STEP_REPOSITORY,
    useClass: ReadApprovalWorkflowStepRepository,
  },
];
