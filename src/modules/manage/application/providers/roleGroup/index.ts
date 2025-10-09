import { Provider } from '@nestjs/common';
import { HandlersProviders } from './command.provider';
import { MapperProviders } from './mapper.provider';
import { WRITE_ROLE_GROUP_REPOSITORY } from '../../constants/inject-key.const';
import { WriteRoleGroupRepository } from '@src/modules/manage/infrastructure/repositories/roleGroup/write.repository';

export const RoleGroupProvider: Provider[] = [
  ...HandlersProviders,
  ...MapperProviders,
  {
    provide: WRITE_ROLE_GROUP_REPOSITORY,
    useClass: WriteRoleGroupRepository,
  },
];
