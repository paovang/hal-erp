import { Provider } from '@nestjs/common';
import { RoleGroupDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/role-group.mapper';
import { RoleGroupDataMapper } from '../../mappers/role-group.mapper';

export const MapperProviders: Provider[] = [
  RoleGroupDataAccessMapper,
  RoleGroupDataMapper,
];
