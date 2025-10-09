import { Provider } from '@nestjs/common';
import { UserApprovalStepHandlersProviders } from './command.provider';
import { UserApprovalStepMapperProviders } from './mapper.provider';
import { UserApprovalStepService } from '../../services/user-approval-step.service';
import {
  USER_APPROVAL_STEP_APPLICATION_SERVICE,
  WRITE_USER_APPROVAL_STEP_REPOSITORY,
} from '../../constants/inject-key.const';
import { WriteUserApprovalStepRepository } from '@src/modules/manage/infrastructure/repositories/userApprovalStep/write.repository';

export const UserApprovalStepProvider: Provider[] = [
  ...UserApprovalStepHandlersProviders,
  ...UserApprovalStepMapperProviders,
  {
    provide: USER_APPROVAL_STEP_APPLICATION_SERVICE,
    useClass: UserApprovalStepService,
  },
  {
    provide: WRITE_USER_APPROVAL_STEP_REPOSITORY,
    useClass: WriteUserApprovalStepRepository,
  },
];
