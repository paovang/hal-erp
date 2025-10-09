import { Provider } from '@nestjs/common';
import { UserApprovalDataMapper } from '../../mappers/user-approval.mapper';
import { UserApprovalDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/user-approval.mapper';

export const UserApprovalMapperProviders: Provider[] = [
  UserApprovalDataAccessMapper,
  UserApprovalDataMapper,
];
