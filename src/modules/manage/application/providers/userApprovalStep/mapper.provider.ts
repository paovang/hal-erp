import { Provider } from '@nestjs/common';
import { UserApprovalStepDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/user-approval-step.mapper';
import { UserApprovalStepDataMapper } from '../../mappers/user-approval-step.mapper';

export const UserApprovalStepMapperProviders: Provider[] = [
  UserApprovalStepDataAccessMapper,
  UserApprovalStepDataMapper,
];
