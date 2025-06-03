import { Provider } from '@nestjs/common';
import { ApprovalWorkflowDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/approval-workflow.mapper';
import { ApprovalWorkflowDataMapper } from '../../mappers/approval-workflow.mapper';

export const ApprovalWorkflowMapperProviders: Provider[] = [
  ApprovalWorkflowDataAccessMapper,
  ApprovalWorkflowDataMapper,
];
