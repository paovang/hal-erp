import { Provider } from '@nestjs/common';
import { ApprovalWorkflowStepDataMapper } from '../../mappers/approval-workflow-step.mapper';
import { ApprovalWorkflowStepDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/approval-workflow-step.mapper';

export const ApprovalWorkflowStepMapperProviders: Provider[] = [
  ApprovalWorkflowStepDataAccessMapper,
  ApprovalWorkflowStepDataMapper,
];
