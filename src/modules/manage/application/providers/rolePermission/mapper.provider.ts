import { Provider } from '@nestjs/common';
import { RolePermissionDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/role-permission.mapper';
import { RolePermissionDataMapper } from '../../mappers/role-permission.mapper';

export const MapperProviders: Provider[] = [
  RolePermissionDataAccessMapper,
  RolePermissionDataMapper,
];
