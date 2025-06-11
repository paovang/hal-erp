import { Provider } from '@nestjs/common';
import { ApprovalWorkflowHandlersProviders } from './command.provider';
import { ApprovalWorkflowMapperProviders } from './mapper.provider';
import {
  LOCALIZATION_SERVICE,
  TRANSACTION_MANAGER_SERVICE,
} from '@src/common/constants/inject-key.const';
import { LocalizationService } from '@src/common/infrastructure/localization/localization.service';
import { TransactionManagerService } from '@src/common/infrastructure/transaction/transaction.service';
import {
  APPROVAL_WORKFLOW_APPLICATION_SERVICE,
  READ_APPROVAL_WORKFLOW_REPOSITORY,
  WRITE_APPROVAL_WORKFLOW_REPOSITORY,
} from '../../constants/inject-key.const';
import { WriteApprovalWorkflowRepository } from '@src/modules/manage/infrastructure/repositories/approvalWorkflow/write.repository';
import { ApprovalWorkflowService } from '../../services/approval-workflow.service';
import { ReadApprovalWorkflowRepository } from '@src/modules/manage/infrastructure/repositories/approvalWorkflow/read.repository';

export const ApprovalWorkflowProvider: Provider[] = [
  ...ApprovalWorkflowHandlersProviders,
  ...ApprovalWorkflowMapperProviders,
  {
    provide: LOCALIZATION_SERVICE,
    useClass: LocalizationService,
  },
  {
    provide: TRANSACTION_MANAGER_SERVICE,
    useClass: TransactionManagerService,
  },
  {
    provide: APPROVAL_WORKFLOW_APPLICATION_SERVICE,
    useClass: ApprovalWorkflowService,
  },
  {
    provide: WRITE_APPROVAL_WORKFLOW_REPOSITORY,
    useClass: WriteApprovalWorkflowRepository,
  },
  {
    provide: READ_APPROVAL_WORKFLOW_REPOSITORY,
    useClass: ReadApprovalWorkflowRepository,
  },
];
