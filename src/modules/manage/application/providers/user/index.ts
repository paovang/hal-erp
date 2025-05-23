import { Provider } from '@nestjs/common';
import {
  READ_USER_REPOSITORY,
  USER_APPLICATION_SERVICE,
  WRITE_USER_REPOSITORY,
} from '../../constants/inject-key.const';
import {
  LOCALIZATION_SERVICE,
  TRANSACTION_MANAGER_SERVICE,
  TRANSFORM_RESULT_SERVICE,
} from '@src/common/constants/inject-key.const';
import { UserService } from '../../services/user.service';
import { UserHandlersProviders } from './command.provider';
import { UserMapperProviders } from './mapper.provider';
import { WriteUserRepository } from '@src/modules/manage/infrastructure/repositories/user/write.repository';
import { ReadUserRepository } from '@src/modules/manage/infrastructure/repositories/user/read.repository';
import { TransformResultService } from '@src/common/utils/services/transform-result.service';
import { RoleProvider } from './role';
import { PermissionProvider } from './permission';
import { LocalizationService } from '@src/common/infrastructure/localization/localization.service';
import { TransactionManagerService } from '@src/common/infrastructure/transaction/transaction.service';

export const UserProvider: Provider[] = [
  ...UserHandlersProviders,
  ...UserMapperProviders,
  ...RoleProvider,
  ...PermissionProvider,
  {
    provide: LOCALIZATION_SERVICE,
    useClass: LocalizationService,
  },
  {
    provide: TRANSACTION_MANAGER_SERVICE,
    useClass: TransactionManagerService,
  },
  {
    provide: USER_APPLICATION_SERVICE,
    useClass: UserService,
  },
  {
    provide: WRITE_USER_REPOSITORY,
    useClass: WriteUserRepository,
  },
  {
    provide: READ_USER_REPOSITORY,
    useClass: ReadUserRepository,
  },
  {
    provide: TRANSFORM_RESULT_SERVICE,
    useClass: TransformResultService,
  },
];
