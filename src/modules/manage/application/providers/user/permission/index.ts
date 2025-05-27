import { Provider } from '@nestjs/common';
import {
  PERMISSION_APPLICATION_SERVICE,
  READ_PERMISSION_REPOSITORY,
} from '../../../constants/inject-key.const';
import { TRANSFORM_RESULT_SERVICE } from '@src/common/constants/inject-key.const';
import { TransformResultService } from '@src/common/utils/services/transform-result.service';
import { PermissionService } from '../../../services/permission.service';
import { ReadPermissionRepository } from '@src/modules/manage/infrastructure/repositories/user/permission/read.repository';
import { PermissionHandlersProviders } from './command.provider';
import { PermissionMapperProviders } from './mapper.provider';

export const PermissionProvider: Provider[] = [
  ...PermissionHandlersProviders,
  ...PermissionMapperProviders,
  {
    provide: PERMISSION_APPLICATION_SERVICE,
    useClass: PermissionService,
  },
  //   {
  //     provide: WRITE_USER_REPOSITORY,
  //     useClass: WriteUserRepository,
  //   },
  {
    provide: READ_PERMISSION_REPOSITORY,
    useClass: ReadPermissionRepository,
  },
  {
    provide: TRANSFORM_RESULT_SERVICE,
    useClass: TransformResultService,
  },
];
