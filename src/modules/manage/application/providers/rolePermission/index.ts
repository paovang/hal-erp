import { Provider } from '@nestjs/common';
import { HandlersProviders } from './command.provider';
import { MapperProviders } from './mapper.provider';
import { WRITE_ROLE_PERMISSION_REPOSITORY } from '../../constants/inject-key.const';
import { WriteRolePermissionRepository } from '@src/modules/manage/infrastructure/repositories/rolePermission/write.repository';

export const RolePermissionProvider: Provider[] = [
  ...HandlersProviders,
  ...MapperProviders,
  {
    provide: WRITE_ROLE_PERMISSION_REPOSITORY,
    useClass: WriteRolePermissionRepository,
  },
];
