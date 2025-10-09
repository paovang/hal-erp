import { Provider } from '@nestjs/common';
import { UserApprovalMapperProviders } from './mapper.provider';
import { UserApprovalHandlersProviders } from './command.provider';
import {
  USER_APPROVAL_APPLICATION_SERVICE,
  WRITE_USER_APPROVAL_REPOSITORY,
} from '../../constants/inject-key.const';
import { UserApprovalService } from '../../services/user-approval.service';
import { WriteUserApprovalRepository } from '@src/modules/manage/infrastructure/repositories/userApproval/write.repository';

export const UserApprovalProvider: Provider[] = [
  ...UserApprovalHandlersProviders,
  ...UserApprovalMapperProviders,
  {
    provide: USER_APPROVAL_APPLICATION_SERVICE,
    useClass: UserApprovalService,
  },
  {
    provide: WRITE_USER_APPROVAL_REPOSITORY,
    useClass: WriteUserApprovalRepository,
  },
  // {
  //   provide: READ_USER_APPROVAL_REPOSITORY,
  //   useClass: ReadUserApprovalRepository,
  // },
];
